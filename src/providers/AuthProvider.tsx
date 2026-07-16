"use client";

import {
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import { AuthContext, type AuthContextType } from "./authContext";
import { syncAuthSession } from "@/actions/authSession";

const googleProvider = new GoogleAuthProvider();

/**
 * Sync Firebase auth state to a server-issued, httpOnly session cookie.
 */
async function syncSessionCookie(user: User | null) {
  if (!user) {
    await syncAuthSession(null);
    return;
  }

  const idToken = await user.getIdToken();
  await syncAuthSession(idToken);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get("redirect");
  const wasAuthenticatedRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const shouldRedirect = Boolean(currentUser) && !wasAuthenticatedRef.current;
      wasAuthenticatedRef.current = Boolean(currentUser);
      setUser(currentUser);
      setIsLoading(true);

      void (async () => {
        try {
          await syncSessionCookie(currentUser);
          if (!isActive) return;
          setAuthError(null);

          const isSafeInternalPath =
            redirectPath?.startsWith("/") && !redirectPath.startsWith("//");
          if (shouldRedirect && redirectPath && isSafeInternalPath) {
            router.push(redirectPath);
          }
        } catch (error) {
          console.error("Failed to sync session cookie:", error);
          if (isActive) {
            setAuthError(
              "Your browser signed in, but the secure server session could not be created. Please try again."
            );
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      })();
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [redirectPath, router]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to sign in";
      // Provide user-friendly error messages
      if (message.includes("popup-closed-by-user")) {
        setAuthError("Sign in was cancelled. Please try again.");
      } else if (message.includes("network")) {
        setAuthError("Network error. Please check your connection.");
      } else {
        setAuthError("Failed to sign in. Please try again.");
      }
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setAuthError(null);
      await signOut(auth);
      // Also clear the server session cookie immediately (auth listener will do it too).
      await syncSessionCookie(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setAuthError("Failed to sign out. Please try again.");
      throw error;
    }
  }, []);

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      authError,
      signInWithGoogle,
      logout,
      clearAuthError,
    }),
    [user, isLoading, authError, signInWithGoogle, logout, clearAuthError]
  );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}
