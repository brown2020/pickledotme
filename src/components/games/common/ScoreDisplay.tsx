import { Trophy, Star } from "lucide-react";

interface ScoreDisplayProps {
  currentScore: number;
  bestScore: number;
}

export function ScoreDisplay({ currentScore, bestScore }: ScoreDisplayProps) {
  return (
    <div className="flex gap-6">
      <div className="text-center">
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-1">
          <Star className="w-4 h-4" />
          <span>Score</span>
        </div>
        <p className="text-2xl font-bold text-emerald-600">
          {currentScore.toLocaleString()}
        </p>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 text-sm text-slate-500 mb-1">
          <Trophy className="w-4 h-4" />
          <span>Best</span>
        </div>
        <p className="text-2xl font-bold text-blue-600">
          {bestScore.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
