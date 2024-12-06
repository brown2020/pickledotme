// src/components/shared/LeaderboardTable.tsx
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { firebaseHelpers } from "@/lib/firebaseHelpers";

interface LeaderboardTableProps {
  gameId: string;
}

// Define the shape of our processed data
interface DisplayScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
}

export function LeaderboardTable({ gameId }: LeaderboardTableProps) {
  const [scores, setScores] = useState<DisplayScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true);
        setError(null);
        // Let the helper function handle the typing
        const firestoreScores = await firebaseHelpers.getHighScores(gameId);

        // Convert Firestore scores to display scores
        const processedScores = firestoreScores.map((firestoreScore) => ({
          id: firestoreScore.id,
          userId: firestoreScore.userId,
          gameId: firestoreScore.gameId,
          score: firestoreScore.score,
          timestamp: firestoreScore.timestamp.toDate(),
        }));

        setScores(processedScores);
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [gameId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (scores.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No scores yet. Be the first to play!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px] bg-white rounded-lg overflow-hidden">
        <thead className="bg-green-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-green-800">
              Rank
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-green-800">
              Player
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-green-800">
              Score
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-green-800">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {scores.map((score, index) => (
            <tr
              key={score.id}
              className={`${
                index < 3 ? "bg-green-50/50" : ""
              } hover:bg-gray-50 transition-colors`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center">
                  {index < 3 ? (
                    <span
                      className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : "bg-amber-600 text-amber-100"
                      }
                    `}
                    >
                      {index + 1}
                    </span>
                  ) : (
                    <span className="w-6 text-gray-500">{index + 1}</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                    {score.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="ml-2 text-gray-900">
                    {score.userId.slice(0, 8)}...
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="font-semibold text-gray-900">
                  {score.score.toLocaleString()}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-500">
                {score.timestamp.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
