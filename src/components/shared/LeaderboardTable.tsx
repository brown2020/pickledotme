"use client";

import { useEffect, useState } from "react";
import { LeaderboardSkeleton } from "@/components/ui";
import { scoreService, DisplayScore } from "@/services/scoreService";
import { GameId } from "@/constants/games";
import { Trophy } from "lucide-react";

interface LeaderboardTableProps {
  gameId: GameId;
}

export function LeaderboardTable({ gameId }: LeaderboardTableProps) {
  const [scores, setScores] = useState<DisplayScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const highScores = await scoreService.getHighScores(gameId);
        setScores(highScores);
      } catch (err) {
        console.error("Error fetching scores:", err);
        setError("Failed to load leaderboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, [gameId]);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center text-rose-500 p-4 bg-rose-50 rounded-xl">
        {error}
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500">No scores yet. Be the first to play!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
              Rank
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
              Player
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
              Score
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {scores.map((score, index) => (
            <tr
              key={score.id}
              className={`${
                index < 3 ? "bg-emerald-50/50" : ""
              } hover:bg-slate-50 transition-colors`}
            >
              <td className="py-3 px-4">
                {index < 3 ? (
                  <span
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        index === 0
                          ? "bg-amber-400 text-amber-900"
                          : index === 1
                          ? "bg-slate-300 text-slate-700"
                          : "bg-amber-600 text-amber-100"
                      }
                    `}
                  >
                    {index + 1}
                  </span>
                ) : (
                  <span className="w-7 text-slate-500 font-medium">
                    {index + 1}
                  </span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {score.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-slate-900 font-medium">
                    {score.userId.slice(0, 8)}...
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="font-bold text-slate-900">
                  {score.score.toLocaleString()}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500">
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
