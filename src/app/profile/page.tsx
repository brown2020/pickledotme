// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

interface GameScore {
  gameId: string;
  score: number;
  timestamp: Timestamp;
}

const GAMES = {
  "sequence-pickle": "Sequence Pickle",
  "matching-pickles": "Matching Pickles",
  "speed-pickle": "Speed Pickle",
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<GameScore[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const scoresQuery = query(
          collection(db, "scores"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(scoresQuery);
        const userScores: GameScore[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userScores.push({
            gameId: data.gameId,
            score: data.score,
            timestamp: data.timestamp,
          });
        });
        setScores(userScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setIsLoading(false);
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

  // Calculate best scores for each game
  const bestScores = Object.keys(GAMES).reduce((acc, gameId) => {
    const gameScores = scores.filter((s) => s.gameId === gameId);
    acc[gameId] = gameScores.reduce(
      (max, score) => Math.max(max, score.score),
      0
    );
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-green-600">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Game Statistics</h2>

        <div className="grid gap-6">
          {Object.entries(GAMES).map(([gameId, gameName]) => (
            <div
              key={gameId}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{gameName}</h3>
                <p className="text-sm text-gray-600">Best Score</p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {bestScores[gameId]?.toLocaleString() || "0"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[...scores]
            .sort(
              (a, b) =>
                b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
            )
            .slice(0, 5)
            .map((score, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">
                    {GAMES[score.gameId as keyof typeof GAMES]}
                  </p>
                  <p className="text-sm text-gray-600">
                    {score.timestamp.toDate().toLocaleDateString()}
                  </p>
                </div>
                <span className="text-lg font-semibold">
                  {score.score.toLocaleString()}
                </span>
              </div>
            ))}

          {scores.length === 0 && (
            <p className="text-center text-gray-500">
              No games played yet. Start playing to see your activity!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
