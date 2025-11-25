"use client";

import { useSpeedPickleGame } from "@/hooks/useSpeedPickleGame";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { GameRules } from "./speed-pickle/GameRules";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { Timer, Clock } from "lucide-react";

export function SpeedPickle() {
  const {
    pickles,
    isPlaying,
    score,
    bestScore,
    timeLeft,
    level,
    startGame,
    handlePickleClick,
  } = useSpeedPickleGame();

  const getGridClass = (length: number) => {
    if (length <= 16) return "grid-cols-4";
    if (length <= 25) return "grid-cols-5";
    return "grid-cols-6";
  };

  return (
    <Card variant="elevated" className="max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-xl">
              <Timer className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Speed Pickle</h2>
              <p className="text-sm text-slate-600">Level {level}</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <ScoreDisplay currentScore={score} bestScore={bestScore} />
            <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-1 text-sm text-slate-500 mb-1">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </div>
              <p
                className={`text-2xl font-bold ${
                  timeLeft <= 10 ? "text-rose-600 animate-pulse" : "text-violet-600"
                }`}
              >
                {timeLeft}s
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Pickle Grid */}
        <div className={`grid ${getGridClass(pickles.length)} gap-3 mb-8`}>
          {pickles.map((pickle) => (
            <button
              key={pickle.id}
              onClick={() => handlePickleClick(pickle.isTarget)}
              disabled={!isPlaying}
              className={`
                aspect-square rounded-xl transition-all duration-200
                hover:scale-95 active:scale-90
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md hover:shadow-lg
              `}
              style={{
                backgroundColor: pickle.isTarget
                  ? `hsl(142, 70%, ${40 - level * 2}%)`
                  : `hsl(142, 70%, ${45 - level * 2}%)`,
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <GameControls
            onStart={startGame}
            onReset={startGame}
            isPlaying={isPlaying}
          />
          {!isPlaying && score > 0 && (
            <p className="text-lg font-bold text-emerald-600">
              Final Score: {score}
            </p>
          )}
        </div>

        {/* Instructions */}
        {!isPlaying && score === 0 && <GameRules />}
      </CardContent>
    </Card>
  );
}
