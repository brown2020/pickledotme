"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

/**
 * Sync Firebase auth state to a server-issued, httpOnly session cookie.
 */
async function syncSessionCookie(user: User | null) {
  try {
    if (!user) {
      await fetch("/api/auth/session", { method: "DELETE" });
      return;
    }

    const idToken = await user.getIdToken();
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    // Session cookie sync failures should not break the client UI.
    console.error("Failed to sync session cookie:", error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const wasLoggedOut = !user;
      setUser(currentUser);
      setIsLoading(false);
      void syncSessionCookie(currentUser);

      // Handle post-login redirect
      if (currentUser && wasLoggedOut) {
        const redirectPath = searchParams.get("redirect");
        if (redirectPath && redirectPath.startsWith("/")) {
          // Validate redirect path to prevent open redirect
          router.push(redirectPath);
        }
      }
    });
    return () => unsubscribe();
  }, [router, searchParams, user]);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        authError,
        signInWithGoogle,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
