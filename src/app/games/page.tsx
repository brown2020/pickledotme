// src/app/games/page.tsx
"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebaseConfig";

const GAMES = [
  {
    id: "sequence-pickle",
    name: "Sequence Pickle",
    description: "Remember the pattern of pickles and repeat it!",
    difficulty: "easy",
  },
  {
    id: "matching-pickles",
    name: "Matching Pickles",
    description: "Find matching pairs of pickles before time runs out!",
    difficulty: "medium",
  },
  {
    id: "speed-pickle",
    name: "Speed Pickle",
    description: "How fast can you spot the different pickle?",
    difficulty: "hard",
  },
];

export default function GamesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (!user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-green-600">Memory Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAMES.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id}>
            <div className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
              <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm ${
                  game.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : game.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {game.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
