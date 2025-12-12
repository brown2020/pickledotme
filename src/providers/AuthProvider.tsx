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
import { auth } from "@/lib/firebaseConfig";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      void syncSessionCookie(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      // Also clear the server session cookie immediately (auth listener will do it too).
      await syncSessionCookie(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signInWithGoogle,
        logout,
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
