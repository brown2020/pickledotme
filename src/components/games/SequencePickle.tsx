// src/components/games/SequencePickle.tsx
"use client";

import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { SEQUENCE_COLORS } from "@/constants/colors";
import { useSequenceGame } from "@/hooks/useSequenceGame";

export function SequencePickle() {
  const {
    sequence,
    playerSequence,
    isPlaying,
    isShowingSequence,
    score,
    bestScore,
    level,
    startGame,
    handleColorClick,
    resetGame,
  } = useSequenceGame();

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-green-600">Sequence Pickle</h2>
          <p className="text-gray-600">Level {level}</p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreDisplay currentScore={score} bestScore={bestScore} />
          {isPlaying && (
            <div className="text-sm font-medium text-gray-600">
              Sequence Length: {sequence.length}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {SEQUENCE_COLORS.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(index)}
            disabled={!isPlaying || isShowingSequence}
            aria-label={`Color ${index + 1}`}
            className={`
              relative h-32 rounded-lg transform
              transition-all duration-200 ease-in-out
              ${!isPlaying ? color.base : color.bg}
              ${!isPlaying || isShowingSequence ? "" : color.hover}
              ${
                playerSequence.includes(index)
                  ? `scale-95 ring-4 ring-white ${color.active}`
                  : ""
              }
              disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            `}
          >
            <div
              className={`
                absolute inset-0 rounded-lg
                transition-opacity duration-200
                ${playerSequence.includes(index) ? "opacity-100" : "opacity-0"}
              `}
            />
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <GameControls
          onStart={startGame}
          onReset={resetGame}
          isPlaying={isPlaying}
        />

        {!isPlaying && score > 0 && (
          <div className="text-lg font-bold text-green-600">
            Final Score: {score}
          </div>
        )}
      </div>

      {!isPlaying && score === 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">How to Play:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Watch the sequence of colors flash</li>
            <li>
              Repeat the sequence by clicking the colors in the same order
            </li>
            <li>Each successful round adds one more color</li>
            <li>Score more points in higher levels</li>
            <li>Try to beat your high score!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
