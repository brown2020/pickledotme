"use client";

import Link from "next/link";
import Auth from "@/components/Auth"; // Import the Auth component
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Import Firebase auth

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null); // To show the user name

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid); // Extract and set the userId
        setDisplayName(currentUser.displayName); // Optionally, set displayName for UI
      } else {
        setUserId(null); // User is not logged in
        setDisplayName(null); // Clear displayName
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-green-600">
          Welcome to Pickle.me!
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          {`Pickle.me is your AI-powered assistant to help you out when you're stuck
          in a pickle. Whether it's a tough decision or a confusing situation,
          simply describe your dilemma, and our AI will provide thoughtful,
          actionable advice.`}
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-green-500">
          How It Works:
        </h2>
        <ul className="list-disc list-inside mb-6 text-gray-700">
          <li>Sign in using your Google account.</li>
          <li>Describe your current dilemma.</li>
          <li>Receive real-time, AI-generated advice to help you out!</li>
        </ul>

        {/* Show login/logout buttons and pass userId as a prop */}
        <div className="mb-6">
          <Auth userId={userId} />
        </div>

        {/* Conditional rendering: If the user is logged in, show "Get Started" button */}
        {userId ? (
          <>
            <p className="text-lg mb-6 text-gray-700">
              Logged in as: <span className="font-semibold">{displayName}</span>
            </p>
            <Link
              href="/pickle"
              className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 inline-block"
            >
              Get Started
            </Link>
          </>
        ) : (
          <p className="text-lg text-gray-600">
            Please sign in to get started.
          </p>
        )}
      </div>
    </div>
  );
}
