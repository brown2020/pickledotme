import { GAMES } from "@/constants/games";
import { GameScore } from "@/hooks/useUserScores";
import { ProfileCard } from "./ProfileCard";

interface GameStatisticsProps {
  scores: GameScore[];
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

  return (
    <ProfileCard title="Game Statistics">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(GAMES).map(([gameId, gameName]) => (
          <div
            key={gameId}
            className="border rounded-lg p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{gameName}</h3>
              <p className="text-sm text-gray-600">Best Score</p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {bestScores[gameId]?.toLocaleString() || "0"}
            </div>
          </div>
        ))}
      </div>
    </ProfileCard>
  );
}
