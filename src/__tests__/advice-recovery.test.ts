import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const cookiesGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: cookiesGet,
  })),
}));

vi.mock("@/lib/authSession", () => ({
  readSessionCookieValue: (store) =>
    store.get("__Host-pickle-session")?.value ??
    store.get("pickle-session")?.value,
  getVerifiedSessionUid: vi.fn(async () => "user-a"),
}));

const create = vi.fn();
const commit = vi.fn(async () => undefined);
let failNextCommit = false;
let threadSeq = 0;

vi.mock("@/lib/firebaseAdmin", () => ({
  getFirebaseAdminFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => {
        threadSeq += 1;
        const id = `thread-${threadSeq}`;
        return {
          id,
          collection: vi.fn(() => ({
            doc: vi.fn(() => ({ id: `${id}-msg` })),
          })),
        };
      }),
    })),
    batch: vi.fn(() => ({
      create: ((ref: unknown, data: unknown) => create(ref, data)) as typeof create,
      commit: async () => {
        if (failNextCommit) {
          failNextCommit = false;
          throw new Error("simulated interrupt");
        }
        return commit();
      },
    })),
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("createAdviceThread recovery", () => {
  beforeEach(() => {
    cookiesGet.mockReturnValue({ value: "valid-session" });
    create.mockReset();
    commit.mockClear();
    failNextCommit = false;
    threadSeq = 0;
    vi.resetModules();
  });

  it("records duplicate submits as separate threads without rejecting the second write", async () => {
    const { createAdviceThread } = await import("@/actions/adviceThreads");
    const first = await createAdviceThread({
      dilemma: "Should I take the job?",
      tone: "balanced",
      modelName: "gpt-5.2",
    });
    const second = await createAdviceThread({
      dilemma: "Should I take the job?",
      tone: "balanced",
      modelName: "gpt-5.2",
    });
    expect(first).not.toEqual(second);
    expect(commit).toHaveBeenCalledTimes(2);
    expect(create).toHaveBeenCalled();
  });

  it("allows a retry after an interrupted create without leaving a partial commit", async () => {
    failNextCommit = true;
    const { createAdviceThread } = await import("@/actions/adviceThreads");
    await expect(
      createAdviceThread({
        dilemma: "Should I move?",
        tone: "balanced",
        modelName: "gpt-5.2",
      })
    ).rejects.toThrow(/interrupt/);
    expect(commit).toHaveBeenCalledTimes(0);
    const retry = await createAdviceThread({
      dilemma: "Should I move?",
      tone: "balanced",
      modelName: "gpt-5.2",
    });
    expect(retry).toMatch(/^thread-/);
    expect(commit).toHaveBeenCalledTimes(1);
  });
});
