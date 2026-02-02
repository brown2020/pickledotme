"use client";

import { LeaderboardSkeleton } from "@/components/ui";
import { useHighScores } from "@/hooks/useScores";
import { GameId } from "@/config/games";
import { Trophy } from "lucide-react";

interface LeaderboardTableProps {
  gameId: GameId;
}

export function LeaderboardTable({ gameId }: LeaderboardTableProps) {
  const { scores, isLoading, isError } = useHighScores(gameId);

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-center">
        Failed to load leaderboard
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">No scores yet. Be the first to play!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
              Rank
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
              Player
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
              Score
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {scores.map((score, index) => (
            <tr
              key={score.id}
              className={`${
                index < 3 ? "bg-emerald-50/50 dark:bg-emerald-900/20" : ""
              } hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors`}
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
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    {score.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium">
                    {score.userId.slice(0, 8)}...
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="font-bold text-slate-900 dark:text-white">
                  {score.score.toLocaleString()}
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
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
