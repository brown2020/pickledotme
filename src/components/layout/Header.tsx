// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Pickle.me
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/pickle"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Get Advice
            </Link>
            <Link
              href="/games"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Games
            </Link>
            {user && (
              <Link
                href="/profile"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Profile
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {user.displayName}
                </span>
                <button
                  onClick={() => auth.signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
