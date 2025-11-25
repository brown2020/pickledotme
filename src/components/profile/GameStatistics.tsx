import { GAMES, GAME_CONFIGS } from "@/config/games";
import { DisplayScore } from "@/services/scoreService";
import { ProfileCard } from "./ProfileCard";
import { Trophy } from "lucide-react";

interface GameStatisticsProps {
  scores: DisplayScore[];
}

export function GameStatistics({ scores }: GameStatisticsProps) {
  const bestScores = Object.keys(GAMES).reduce((acc, gameId) => {
    const gameScores = scores.filter((s) => s.gameId === gameId);
    acc[gameId] = gameScores.reduce(
      (max, score) => Math.max(max, score.score),
      0
    );
    return acc;
  }, {} as Record<string, number>);

  const gamesPlayed = Object.keys(GAMES).reduce((acc, gameId) => {
    acc[gameId] = scores.filter((s) => s.gameId === gameId).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ProfileCard title="Game Statistics">
      <div className="grid gap-4 md:grid-cols-3">
        {GAME_CONFIGS.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${game.bgColor} ${game.color} dark:bg-opacity-20`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{game.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Best Score</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {bestScores[game.id]?.toLocaleString() || "0"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Games Played</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {gamesPlayed[game.id] || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ProfileCard>
  );
}
