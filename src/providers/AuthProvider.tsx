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
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { AuthContext, type AuthContextType } from "./authContext";
import { syncAuthSession } from "@/actions/authSession";

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
    await syncAuthSession(null);
    return;
  }
  const idToken = await user.getIdToken();
  await syncAuthSession(idToken);
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

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch({ type: "sync-start", user: currentUser });

      void (async () => {
        try {
          await syncSessionCookie(currentUser);
          if (!isActive) return;
          dispatch({ type: "sync-success", user: currentUser });
        } catch (error) {
          console.error("Failed to sync session cookie:", error);
          if (isActive) {
            dispatch({
              type: "sync-failure",
              message:
                "Your browser signed in, but the secure server session could not be created. Please try again.",
            });
          }
        }
      })();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  const clearAuthError = useCallback(() => {
    dispatch({ type: "set-error", message: null });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: "set-error", message: null });
      await signInWithPopup(auth, googleProvider);
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
      logout,
      clearAuthError,
    }),
    [
      state.user,
      state.isLoading,
      state.authError,
      signInWithGoogle,
      logout,
      clearAuthError,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
