// src/components/games/SpeedPickle.tsx
"use client";

import { useSpeedPickleGame } from "@/hooks/useSpeedPickleGame";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { GameRules } from "./speed-pickle/GameRules";

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
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-green-600">Speed Pickle</h2>
          <p className="text-gray-600">Level {level}</p>
        </div>
        <div className="flex gap-8 items-center">
          <ScoreDisplay currentScore={score} bestScore={bestScore} />
          <div className="text-center">
            <p className="text-sm text-gray-600">Time</p>
            <p
              className={`text-2xl font-bold ${
                timeLeft <= 10 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {timeLeft}s
            </p>
          </div>
        </div>
      </div>

      <div className={`grid ${getGridClass(pickles.length)} gap-4 mb-8`}>
        {pickles.map((pickle) => (
          <button
            key={pickle.id}
            onClick={() => handlePickleClick(pickle.isTarget)}
            disabled={!isPlaying}
            style={{
              backgroundColor: `rgb(${pickle.shade % 255}, ${
                pickle.shade % 255
              }, ${pickle.shade % 255})`,
            }}
            className={`
              aspect-square rounded-lg transition-all transform duration-200
              hover:scale-95 active:scale-90
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      <div className="flex justify-between items-center">
        <GameControls
          onStart={startGame}
          onReset={startGame}
          isPlaying={isPlaying}
        />
        {!isPlaying && score > 0 && (
          <div className="text-lg font-semibold text-green-600">
            Final Score: {score}
          </div>
        )}
      </div>

      {!isPlaying && score === 0 && <GameRules />}
    </div>
  );
}
