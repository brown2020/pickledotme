// src/components/games/common/ScoreDisplay.tsx
interface ScoreDisplayProps {
  currentScore: number;
  bestScore: number;
}

export function ScoreDisplay({ currentScore, bestScore }: ScoreDisplayProps) {
  return (
    <div className="flex gap-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">Score</p>
        <p className="text-2xl font-bold text-green-600">{currentScore}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Best</p>
        <p className="text-2xl font-bold text-blue-600">{bestScore}</p>
      </div>
    </div>
  );
}
