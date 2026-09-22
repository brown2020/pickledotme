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
  readSessionCookieValue: (store) =>
    store.get("__Host-pickle-session")?.value ??
    store.get("pickle-session")?.value,
  getVerifiedSessionUid: vi.fn(async (value: string | undefined) =>
    value === "valid-session" ? "user-a" : null
  ),
}));

vi.mock("@/lib/firebaseAdmin", () => ({
  getFirebaseAdminFirestore: vi.fn(() => {
    throw new Error("Firestore should not be reached for unauthenticated calls");
  }),
}));

describe("saveGameResult auth boundary", () => {
  beforeEach(() => {
    cookiesGet.mockReset();
    vi.resetModules();
  });

  it("denies unauthenticated score writes inside the server action", async () => {
    cookiesGet.mockReturnValue(undefined);
    const { saveGameResult } = await import("@/actions/scores");
    await expect(
      saveGameResult({ gameId: "sequence-pickle", score: 10 })
    ).rejects.toThrow(/Authentication required/i);
  });

  it("denies score writes when the session cookie is invalid", async () => {
    cookiesGet.mockReturnValue({ value: "bogus" });
    const { saveGameResult } = await import("@/actions/scores");
    await expect(
      saveGameResult({ gameId: "sequence-pickle", score: 10 })
    ).rejects.toThrow(/Authentication required/i);
  });
});

describe("scoreSubmissionSchema", () => {
  it("rejects invalid payloads before persistence", async () => {
    const { validateOrThrow, scoreSubmissionSchema } = await import(
      "@/lib/validations"
    );
    expect(() =>
      validateOrThrow(scoreSubmissionSchema, {
        gameId: "not-a-game",
        score: -1,
      })
    ).toThrow();
    expect(() =>
      validateOrThrow(scoreSubmissionSchema, {
        gameId: "sequence-pickle",
        score: 1.5,
      })
    ).toThrow();
  });

  it("accepts a valid score submission shape", async () => {
    const { validateOrThrow, scoreSubmissionSchema } = await import(
      "@/lib/validations"
    );
    expect(
      validateOrThrow(scoreSubmissionSchema, {
        gameId: "sequence-pickle",
        score: 42,
      })
    ).toEqual({ gameId: "sequence-pickle", score: 42 });
  });
});

describe("createAdviceThread auth boundary", () => {
  beforeEach(() => {
    cookiesGet.mockReset();
    vi.resetModules();
  });

  it("denies unauthenticated advice thread creation inside the server action", async () => {
    cookiesGet.mockReturnValue(undefined);
    const { createAdviceThread } = await import("@/actions/adviceThreads");
    await expect(
      createAdviceThread({
        dilemma: "I need practical help choosing between two job offers today.",
        tone: "balanced",
        modelName: "gpt-5.2",
      })
    ).rejects.toThrow(/Authentication required/i);
  });
});
