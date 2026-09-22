"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { AuthContext, type AuthContextType } from "./authContext";

const googleProvider = new GoogleAuthProvider();

type AuthState = {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
};

type AuthAction =
  | { type: "sync-start"; user: User | null }
  | { type: "sync-success"; user: User | null }
  | { type: "sync-failure"; message: string }
  | { type: "set-error"; message: string | null };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "sync-start":
      return { user: action.user, isLoading: true, authError: null };
    case "sync-success":
      return { user: action.user, isLoading: false, authError: null };
    case "sync-failure":
      return { ...state, isLoading: false, authError: action.message };
    case "set-error":
      return { ...state, authError: action.message };
    default:
      return state;
  }
}

async function syncSessionCookie(user: User | null) {
  if (!user) {
    const response = await fetch("/api/auth/session", { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to clear session cookie");
    }
    return;
  }
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!response.ok) {
    throw new Error("Failed to create session cookie");
  }
}

function readSafeRedirectPath(): string | null {
  if (typeof window === "undefined") return null;
  const redirectPath = new URLSearchParams(window.location.search).get(
    "redirect"
  );
  if (!redirectPath?.startsWith("/") || redirectPath.startsWith("//")) {
    return null;
  }
  return redirectPath;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    authError: null,
  });

  // Observe Firebase auth only — do not fetch in this effect (react-doctor/no-fetch-in-effect).
  // Session cookies are written in sign-in / sign-out handlers below.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch({ type: "sync-success", user: currentUser });
    });
    return unsubscribe;
  }, []);

  const clearAuthError = useCallback(() => {
    dispatch({ type: "set-error", message: null });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: "set-error", message: null });
      const credential = await signInWithPopup(auth, googleProvider);
      await syncSessionCookie(credential.user);
      dispatch({ type: "sync-success", user: credential.user });
      const redirectPath = readSafeRedirectPath();
      if (redirectPath) {
        // Full navigation after popup auth — avoids useEffect client redirects.
        window.location.assign(redirectPath);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to sign in";
      if (message.includes("popup-closed-by-user")) {
        dispatch({
          type: "set-error",
          message: "Sign in was cancelled. Please try again.",
        });
      } else if (message.includes("network")) {
        dispatch({
          type: "set-error",
          message: "Network error. Please check your connection.",
        });
      } else {
        dispatch({
          type: "set-error",
          message: "Failed to sign in. Please try again.",
        });
      }
      throw error;
    }
  }, []);


  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: "set-error", message: null });
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      // Ensure the httpOnly session cookie exists before any protected navigation.
      await syncSessionCookie(credential.user);
      dispatch({ type: "sync-success", user: credential.user });
      const redirectPath = readSafeRedirectPath();
      if (redirectPath) {
        window.location.assign(redirectPath);
      }
    } catch (error) {
      console.error("Email sign in error:", error);
      dispatch({
        type: "set-error",
        message: "Email sign-in failed. Check your email and password.",
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: "set-error", message: null });
      await signOut(auth);
      await syncSessionCookie(null);
    } catch (error) {
      console.error("Sign out error:", error);
      dispatch({
        type: "set-error",
        message: "Failed to sign out. Please try again.",
      });
      throw error;
    }
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user: state.user,
      isLoading: state.isLoading,
      isAuthenticated: Boolean(state.user),
      authError: state.authError,
      signInWithGoogle,
      signInWithEmail,
      logout,
      clearAuthError,
    }),
    [
      state.user,
      state.isLoading,
      state.authError,
      signInWithGoogle,
      signInWithEmail,
      logout,
      clearAuthError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
