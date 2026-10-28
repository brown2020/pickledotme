import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ADVICE_LIMIT,
  ADVICE_WINDOW_MS,
  nextRateBucket,
  SCORE_LIMIT,
} from "@/lib/rateBucket";
import {
  assertVerifiedAdviceSession,
  RateLimitError,
  toPublicAdviceError,
} from "@/lib/adviceAccess";
import { buildContentSecurityPolicy } from "@/lib/contentSecurityPolicy";
import { safeInternalPath, withSafeRedirect } from "@/lib/safeRedirect";
import {
  classifySessionVerificationError,
  sessionCookieClearAttributes,
} from "@/lib/sessionPolicy";
import { validateOrThrow, scoreSubmissionSchema } from "@/lib/validations";

describe("safeInternalPath", () => {
  it("allows same-origin app paths", () => {
    expect(safeInternalPath("/games")).toBe("/games");
    expect(safeInternalPath("/pickle?x=1")).toBe("/pickle?x=1");
    expect(withSafeRedirect("/signup", "/profile")).toBe(
      "/signup?redirect=%2Fprofile"
    );
  });

  it("rejects open-redirect bypasses", () => {
    expect(safeInternalPath("//evil.com")).toBeNull();
    expect(safeInternalPath("/\\evil.com")).toBeNull();
    expect(safeInternalPath("/\tevil.com")).toBeNull();
    expect(safeInternalPath("/\nevil.com")).toBeNull();
    expect(safeInternalPath("https://evil.com")).toBeNull();
    expect(safeInternalPath("\\\\evil.com")).toBeNull();
    expect(withSafeRedirect("/login", "/\\evil.com")).toBe("/login");
  });
});

describe("session cookie policy", () => {
  it("clears host cookies only when the token itself is invalid", () => {
    expect(
      classifySessionVerificationError({ code: "auth/session-cookie-expired" })
    ).toBe("invalid");
    expect(
      classifySessionVerificationError({ code: "auth/session-cookie-revoked" })
    ).toBe("invalid");
    expect(
      classifySessionVerificationError({ code: "auth/invalid-argument" })
    ).toBe("invalid");
    expect(
      classifySessionVerificationError({ code: "auth/insufficient-permission" })
    ).toBe("unavailable");
    expect(classifySessionVerificationError(new Error("fetch failed"))).toBe(
      "unavailable"
    );
  });

  it("sets Secure and omits Domain when clearing the __Host- cookie", () => {
    const attributes = sessionCookieClearAttributes(
      "__Host-pickle-session",
      false
    );
    expect(attributes.secure).toBe(true);
    expect(attributes.path).toBe("/");
    expect(attributes.httpOnly).toBe(true);
    expect(attributes).not.toHaveProperty("domain");
    expect(
      sessionCookieClearAttributes("pickle-session", false).secure
    ).toBe(false);
  });
});

describe("advice billing controls", () => {
  it("requires a verified email before advice", () => {
    expect(() => assertVerifiedAdviceSession(null)).toThrow(
      /Authentication required/i
    );
    expect(() =>
      assertVerifiedAdviceSession({ uid: "user-a", emailVerified: false })
    ).toThrow(/Verify your email/i);
    expect(
      assertVerifiedAdviceSession({ uid: "user-a", emailVerified: true })
    ).toBe("user-a");
  });

  it("stops a user after the hourly advice allowance", () => {
    let bucket: { count: number; windowStartMs: number } | undefined;
    for (let i = 0; i < ADVICE_LIMIT; i += 1) {
      bucket = nextRateBucket(bucket, 1_000, ADVICE_LIMIT, ADVICE_WINDOW_MS);
    }
    expect(bucket?.count).toBe(ADVICE_LIMIT);
    expect(() =>
      nextRateBucket(bucket, 1_000, ADVICE_LIMIT, ADVICE_WINDOW_MS)
    ).toThrow(RateLimitError);
    const reset = nextRateBucket(
      bucket,
      1_000 + ADVICE_WINDOW_MS,
      ADVICE_LIMIT,
      ADVICE_WINDOW_MS
    );
    expect(reset.count).toBe(1);
  });

  it("does not forward provider error text to the client", () => {
    const leaked = new Error("Incorrect API key provided: sk-secret-key");
    expect(toPublicAdviceError(leaked).message).toBe(
      "The advice service is unavailable. Please try again."
    );
    expect(toPublicAdviceError(leaked).message).not.toMatch(/sk-secret/);
    expect(toPublicAdviceError(new RateLimitError()).message).toMatch(
      /Too many requests/i
    );
  });
});

describe("client score bounds", () => {
  it("rejects scores above the per-game client ceiling", () => {
    expect(() =>
      validateOrThrow(scoreSubmissionSchema, {
        gameId: "reaction-pickle",
        score: 1001,
      })
    ).toThrow(/allowed range/i);
    expect(() =>
      validateOrThrow(scoreSubmissionSchema, {
        gameId: "matching-pickles",
        score: 801,
      })
    ).toThrow(/allowed range/i);
    expect(
      validateOrThrow(scoreSubmissionSchema, {
        gameId: "reaction-pickle",
        score: 1000,
      })
    ).toEqual({ gameId: "reaction-pickle", score: 1000 });
  });

  it("keeps the hourly score allowance finite", () => {
    expect(SCORE_LIMIT).toBeGreaterThan(0);
    expect(SCORE_LIMIT).toBeLessThan(1000);
  });
});

describe("production content security policy", () => {
  it("uses a nonce and does not allow unsafe-eval or unsafe-inline scripts", () => {
    const policy = buildContentSecurityPolicy("noncevalue", false);
    expect(policy).toContain("'nonce-noncevalue'");
    expect(policy).toContain("'strict-dynamic'");
    expect(policy).not.toContain("'unsafe-eval'");
    expect(policy).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(policy.split(";").some((part) => part.includes("script-src") && part.includes("'unsafe-inline'"))).toBe(false);
  });
});

describe("security rules files", () => {
  const firestore = readFileSync(
    resolve(process.cwd(), "firestore.rules"),
    "utf8"
  );
  const storage = readFileSync(resolve(process.cwd(), "storage.rules"), "utf8");

  it("does not let signed-in clients read every score or best score", () => {
    const best = firestore.slice(
      firestore.indexOf("match /bestScores/"),
      firestore.indexOf("match /scores/")
    );
    const legacy = firestore.slice(
      firestore.indexOf("match /scores/"),
      firestore.indexOf("match /rateLimits/")
    );
    expect(best).toContain("allow read, write: if false");
    expect(best).not.toContain("signedIn()");
    expect(legacy).toContain("resource.data.userId == request.auth.uid");
    expect(legacy).not.toMatch(/allow read: if signedIn\(\);/);
    expect(firestore).toContain("match /rateLimits/{uid}");
  });

  it("caps storage uploads by size and image content type", () => {
    expect(storage).toContain("request.resource.size < 5 * 1024 * 1024");
    expect(storage).toContain("request.resource.contentType.matches(");
    expect(storage).not.toContain("allow read, write: if isOwner(uid)");
  });
});
