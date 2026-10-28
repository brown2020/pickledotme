"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { mapFirebaseAuthError } from "@/lib/firebaseAuthErrors";
import { safeInternalPath } from "@/lib/safeRedirect";
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
  const idToken = await user.getIdToken(true);
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
  return safeInternalPath(
    new URLSearchParams(window.location.search).get("redirect")
  );
}

function navigateAfterSession(path: string) {
  // Full page load so the proxy observes the new httpOnly session cookie.
  window.location.assign(path);
}

function dispatchMappedError(
  dispatch: Dispatch<AuthAction>,
  error: unknown,
  fallback: string
) {
  dispatch({
    type: "set-error",
    message: mapFirebaseAuthError(error, fallback),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    authError: null,
  });

  // Refresh the server session whenever Firebase restores a user. The cookie
  // lasts 7 days; the Firebase user lasts longer, so a visit must mint a new cookie.
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      void (async () => {
        if (!currentUser) {
          if (active) dispatch({ type: "sync-success", user: null });
          return;
        }
        try {
          await syncSessionCookie(currentUser);
          if (!active) return;
          dispatch({ type: "sync-success", user: currentUser });
          const path = window.location.pathname;
          if (
            path === "/login" ||
            path === "/signup" ||
            path === "/forgot-password"
          ) {
            navigateAfterSession(readSafeRedirectPath() ?? "/");
          }
        } catch (error) {
          if (!active) return;
          dispatch({
            type: "sync-failure",
            message: mapFirebaseAuthError(
              error,
              "Failed to refresh your session. Please sign in again."
            ),
          });
        }
      })();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const clearAuthError = useCallback(() => {
    dispatch({ type: "set-error", message: null });
  }, []);

  const finishAuthenticatedSession = useCallback(async (user: User) => {
    await syncSessionCookie(user);
    dispatch({ type: "sync-success", user });
    const redirectPath = readSafeRedirectPath();
    if (redirectPath) {
      navigateAfterSession(redirectPath);
      return;
    }
    // Leave dedicated auth pages after a successful sign-in / sign-up.
    const path = window.location.pathname;
    if (
      path === "/login" ||
      path === "/signup" ||
      path === "/forgot-password"
    ) {
      navigateAfterSession("/");
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: "set-error", message: null });
      const credential = await signInWithPopup(auth, googleProvider);
      await finishAuthenticatedSession(credential.user);
    } catch (error) {
      // Handled via authError — do not rethrow (avoids Next.js FirebaseError overlay).
      dispatchMappedError(
        dispatch,
        error,
        "Failed to sign in. Please try again."
      );
    }
  }, [finishAuthenticatedSession]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch({ type: "set-error", message: null });
        const credential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        await finishAuthenticatedSession(credential.user);
      } catch (error) {
        dispatchMappedError(
          dispatch,
          error,
          "Email sign-in failed. Check your email and password."
        );
      }
    },
    [finishAuthenticatedSession]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        dispatch({ type: "set-error", message: null });
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        try {
          await sendEmailVerification(credential.user);
        } catch (verificationError) {
          console.error("Failed to send verification email:", verificationError);
        }
        await finishAuthenticatedSession(credential.user);
      } catch (error) {
        dispatchMappedError(
          dispatch,
          error,
          "Could not create account. Please try again."
        );
      }
    },
    [finishAuthenticatedSession]
  );

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      dispatch({ type: "set-error", message: null });
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (error) {
      dispatchMappedError(
        dispatch,
        error,
        "Could not send reset email. Check the address and try again."
      );
      return false;
    }
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) return false;
    try {
      dispatch({ type: "set-error", message: null });
      await sendEmailVerification(current);
      return true;
    } catch (error) {
      dispatchMappedError(
        dispatch,
        error,
        "Could not send verification email. Try again."
      );
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      dispatch({ type: "set-error", message: null });
      await signOut(auth);
      await syncSessionCookie(null);
    } catch (error) {
      dispatchMappedError(
        dispatch,
        error,
        "Failed to sign out. Please try again."
      );
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
      signUpWithEmail,
      sendPasswordReset,
      sendVerificationEmail,
      logout,
      clearAuthError,
    }),
    [
      state.user,
      state.isLoading,
      state.authError,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      sendPasswordReset,
      sendVerificationEmail,
      logout,
      clearAuthError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
