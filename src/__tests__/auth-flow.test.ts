import { describe, expect, it } from "vitest";
import {
  shouldLeaveAuthPage,
  shouldPreserveAuthError,
} from "@/lib/authFlow";

describe("auth page navigation after sign-in", () => {
  it("leaves /login only for an idle restored user", () => {
    expect(shouldLeaveAuthPage("/login", "idle", true)).toBe(true);
    expect(shouldLeaveAuthPage("/signup", "idle", true)).toBe(true);
    expect(shouldLeaveAuthPage("/forgot-password", "idle", true)).toBe(true);
  });

  it("stays on /login when Google sign-in is in flight or has failed", () => {
    expect(shouldLeaveAuthPage("/login", "pending", true)).toBe(false);
    expect(shouldLeaveAuthPage("/login", "failed", true)).toBe(false);
    expect(shouldLeaveAuthPage("/signup", "failed", true)).toBe(false);
  });

  it("does not leave when nobody is signed in", () => {
    expect(shouldLeaveAuthPage("/login", "idle", false)).toBe(false);
    expect(shouldLeaveAuthPage("/login", "failed", false)).toBe(false);
  });

  it("does not treat other routes as auth pages", () => {
    expect(shouldLeaveAuthPage("/", "idle", true)).toBe(false);
    expect(shouldLeaveAuthPage("/games", "idle", true)).toBe(false);
  });

  it("keeps the sign-in error until the attempt is idle again", () => {
    expect(shouldPreserveAuthError("failed")).toBe(true);
    expect(shouldPreserveAuthError("pending")).toBe(true);
    expect(shouldPreserveAuthError("idle")).toBe(false);
  });
});
