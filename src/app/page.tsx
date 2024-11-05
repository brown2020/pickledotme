// src/app/page.tsx
"use client";

import Link from "next/link";
import Auth from "@/components/Auth";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Brain, MessageSquare, Gamepad2 } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      title: "AI Advice",
      description:
        "Get thoughtful, actionable advice for any dilemma you're facing",
      link: "/pickle",
    },
    {
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      title: "Memory Games",
      description: "Train your brain with fun, pickle-themed memory challenges",
      link: "/games",
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-purple-500" />,
      title: "Track Progress",
      description: "Monitor your performance and compete on the leaderboard",
      link: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6 text-green-600">
            Welcome to Pickle.me!
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            {`Your all-in-one platform for problem-solving and brain training. Get
            AI-powered advice when you're in a pickle, and keep your mind sharp
            with our memory games.`}
          </p>

          <div className="mb-6">
            <Auth userId={user?.uid || null} />
          </div>

          {user ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                Welcome back,{" "}
                <span className="font-semibold">{user.displayName}</span>!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/pickle"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Get Advice
                </Link>
                <Link
                  href="/games"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Play Games
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              Sign in to get started with all our features!
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              {user && (
                <Link
                  href={feature.link}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Try it out →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-500">
            How It Works:
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">AI Advice</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Sign in with your Google account</li>
                <li>Describe your current dilemma</li>
                <li>Get personalized, thoughtful advice</li>
                <li>Take action with confidence</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Memory Games</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Choose from various pickle-themed games</li>
                <li>Challenge yourself with increasing difficulty</li>
                <li>Track your high scores and progress</li>
                <li>Compete with other players</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
