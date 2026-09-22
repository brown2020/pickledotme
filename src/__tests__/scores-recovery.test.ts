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
        const tx = {
          get: async () => ({
            data: () => ({
              score: bestScore,
              userId: "user-a",
              gameId: "sequence-pickle",
            }),
          }),
          create,
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
});
