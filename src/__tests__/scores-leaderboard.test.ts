import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const cookiesGet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    get: cookiesGet,
  })),
}));

vi.mock("@/lib/authSession", () => ({
  readSessionCookieValue: (store: { get: (n: string) => { value: string } | undefined }) =>
    store.get("__Host-pickle-session")?.value ??
    store.get("pickle-session")?.value,
  getVerifiedSessionUid: vi.fn(async (value: string | undefined) =>
    value === "valid-session" ? "user-a" : null
  ),
}));

const bestGet = vi.fn();
const legacyGet = vi.fn();

vi.mock("@/lib/firebaseAdmin", () => ({
  getFirebaseAdminFirestore: vi.fn(() => ({
    collection: vi.fn((name: string) => ({
      where: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => ({
            get: name === "scores" ? legacyGet : bestGet,
          })),
        })),
        limit: vi.fn(() => ({
          get: name === "bestScores" ? bestGet : legacyGet,
        })),
      })),
    })),
  })),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

function doc(id: string, data: Record<string, unknown>) {
  return { id, data: () => data };
}

describe("getHighScores leaderboard", () => {
  beforeEach(() => {
    cookiesGet.mockReturnValue({ value: "valid-session" });
    bestGet.mockReset();
    legacyGet.mockReset();
    vi.resetModules();
  });

  it("returns empty array when there are no scores (not an error)", async () => {
    bestGet.mockResolvedValue({ docs: [] });
    legacyGet.mockResolvedValue({ docs: [] });
    const { getHighScores } = await import("@/actions/scores");
    await expect(getHighScores("sequence-pickle")).resolves.toEqual([]);
  });

  it("sorts bestScores in memory and returns top entries", async () => {
    bestGet.mockResolvedValue({
      docs: [
        doc("a", {
          userId: "u1",
          gameId: "sequence-pickle",
          score: 10,
          timestamp: new Date("2026-01-01T00:00:00Z"),
        }),
        doc("b", {
          userId: "u2",
          gameId: "sequence-pickle",
          score: 50,
          timestamp: new Date("2026-01-02T00:00:00Z"),
        }),
        doc("c", {
          userId: "u3",
          gameId: "sequence-pickle",
          score: 30,
          timestamp: new Date("2026-01-03T00:00:00Z"),
        }),
      ],
    });
    const { getHighScores } = await import("@/actions/scores");
    const scores = await getHighScores("sequence-pickle");
    expect(scores.map((s) => s.score)).toEqual([50, 30, 10]);
    expect(legacyGet).not.toHaveBeenCalled();
  });

  it("treats legacy index failures as empty when bestScores is empty", async () => {
    bestGet.mockResolvedValue({ docs: [] });
    legacyGet.mockRejectedValue(new Error("FAILED_PRECONDITION: index"));
    const { getHighScores } = await import("@/actions/scores");
    await expect(getHighScores("sequence-pickle")).resolves.toEqual([]);
  });
});
