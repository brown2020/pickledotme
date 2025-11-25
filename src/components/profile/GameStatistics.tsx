import { GAMES } from "@/constants/games";
import { GameScore } from "@/hooks/useUserScores";
import { ProfileCard } from "./ProfileCard";
import { Trophy, Zap, Grid3X3, Timer } from "lucide-react";

interface GameStatisticsProps {
  scores: GameScore[];
}

const gameIcons: Record<string, React.ReactNode> = {
  "sequence-pickle": <Zap className="w-5 h-5" />,
  "matching-pickles": <Grid3X3 className="w-5 h-5" />,
  "speed-pickle": <Timer className="w-5 h-5" />,
};

const gameColors: Record<string, string> = {
  "sequence-pickle": "bg-emerald-100 text-emerald-600",
  "matching-pickles": "bg-blue-100 text-blue-600",
  "speed-pickle": "bg-violet-100 text-violet-600",
};

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
        {Object.entries(GAMES).map(([gameId, gameName]) => (
          <div
            key={gameId}
            className="rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${gameColors[gameId]}`}>
                {gameIcons[gameId]}
              </div>
              <h3 className="font-bold text-slate-900">{gameName}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Best Score</span>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-900">
                    {bestScores[gameId]?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Games Played</span>
                <span className="font-medium text-slate-700">
                  {gamesPlayed[gameId] || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
