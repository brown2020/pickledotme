"use client";

import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { SEQUENCE_COLORS } from "@/constants/colors";
import { useSequenceGame } from "@/hooks/useSequenceGame";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { Zap } from "lucide-react";

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
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Sequence Pickle
              </h2>
              <p className="text-sm text-slate-600">Level {level}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ScoreDisplay currentScore={score} bestScore={bestScore} />
            {isPlaying && (
              <div className="text-center px-4 py-2 bg-white rounded-xl shadow-sm">
                <p className="text-xs text-slate-500">Sequence</p>
                <p className="text-lg font-bold text-slate-900">{sequence.length}</p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Color Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {SEQUENCE_COLORS.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorClick(index)}
              disabled={!isPlaying || isShowingSequence}
              aria-label={`Color ${index + 1}`}
              className={`
                relative h-28 md:h-32 rounded-2xl transform
                transition-all duration-200 ease-out
                ${!isPlaying ? color.base : color.bg}
                ${!isPlaying || isShowingSequence ? "" : color.hover}
                ${
                  playerSequence.includes(index)
                    ? `scale-95 ring-4 ring-white shadow-lg ${color.active}`
                    : "shadow-md"
                }
                disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400
              `}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <GameControls
            onStart={startGame}
            onReset={resetGame}
            isPlaying={isPlaying}
          />

          {!isPlaying && score > 0 && (
            <p className="text-lg font-bold text-emerald-600">
              Final Score: {score}
            </p>
          )}
        </div>

        {/* Instructions */}
        {!isPlaying && score === 0 && (
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-3">How to Play:</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">1</span>
                Watch the sequence of colors flash
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">2</span>
                Repeat the sequence by clicking the colors
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">3</span>
                Each round adds one more color
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-sm font-bold">4</span>
                Score more points in higher levels!
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
