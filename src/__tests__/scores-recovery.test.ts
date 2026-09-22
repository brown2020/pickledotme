import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const cookiesGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: cookiesGet,
  })),
}));

vi.mock("@/lib/authSession", () => ({
  SESSION_COOKIE_NAME: "pickle-session",
  getVerifiedSessionUid: vi.fn(async () => "user-a"),
}));

const create = vi.fn();
const set = vi.fn();
let bestScore = 10;
let transactionDelayMs = 0;
let failNextCreate = false;

vi.mock("@/lib/firebaseAdmin", () => ({
  getFirebaseAdminFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({ id: "doc" })),
    })),
    runTransaction: vi.fn(
      async (
        fn: (tx: {
          get: (ref: unknown) => Promise<{
            data: () => Record<string, unknown> | undefined;
          }>;
          create: typeof create;
          set: typeof set;
        }) => Promise<{ isNewBest: boolean }>
      ) => {
        if (transactionDelayMs > 0) {
          await new Promise((r) => setTimeout(r, transactionDelayMs));
        }
        const tx = {
          get: async () => ({
            data: () => ({
              score: bestScore,
              userId: "user-a",
              gameId: "sequence-pickle",
            }),
          }),
          create: ((ref: unknown, data: unknown) => {
            if (failNextCreate) {
              failNextCreate = false;
              throw new Error("simulated interrupt");
            }
            return create(ref, data);
          }) as typeof create,
          set: ((ref: unknown, data: { score: number }) => {
            bestScore = data.score;
            return set(ref, data);
          }) as typeof set,
        };
        return fn(tx);
      }
    ),
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("saveGameResult recovery", () => {
  beforeEach(() => {
    cookiesGet.mockReturnValue({ value: "valid-session" });
    create.mockReset();
    set.mockReset();
    bestScore = 10;
    transactionDelayMs = 0;
    failNextCreate = false;
    vi.resetModules();
  });

  it("records duplicate submits as separate history rows without rejecting the second write", async () => {
    const { saveGameResult } = await import("@/actions/scores");
    const first = await saveGameResult({ gameId: "sequence-pickle", score: 12 });
    const second = await saveGameResult({
      gameId: "sequence-pickle",
      score: 12,
    });
    expect(first.isNewBest).toBe(true);
    expect(second.isNewBest).toBe(false);
    expect(create).toHaveBeenCalledTimes(2);
  });

  it("keeps durable best score coherent under concurrent higher submits", async () => {
    transactionDelayMs = 40;
    const { saveGameResult } = await import("@/actions/scores");
    const [a, b] = await Promise.all([
      saveGameResult({ gameId: "sequence-pickle", score: 15 }),
      saveGameResult({ gameId: "sequence-pickle", score: 18 }),
    ]);
    expect([a.isNewBest, b.isNewBest].filter(Boolean).length).toBeGreaterThanOrEqual(1);
    expect(create).toHaveBeenCalledTimes(2);
    expect(bestScore).toBeGreaterThanOrEqual(15);
  });

  it("allows a retry after an interrupted write without corrupting best score", async () => {
    failNextCreate = true;
    const { saveGameResult } = await import("@/actions/scores");
    await expect(
      saveGameResult({ gameId: "sequence-pickle", score: 20 })
    ).rejects.toThrow(/interrupt/);
    expect(bestScore).toBe(10);
    const retry = await saveGameResult({ gameId: "sequence-pickle", score: 20 });
    expect(retry.isNewBest).toBe(true);
    expect(bestScore).toBe(20);
    expect(create).toHaveBeenCalledTimes(1);
  });
});
