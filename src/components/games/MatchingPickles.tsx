"use client";

import { useMatchingGame } from "@/hooks/useMatchingGame";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { MatchingCard } from "./matching/MatchingCard";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { Grid3X3 } from "lucide-react";

export function MatchingPickles() {
  const {
    cards,
    isPlaying,
    score,
    bestScore,
    moveCount,
    isChecking,
    flippedCards,
    startGame,
    handleCardClick,
  } = useMatchingGame();

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
              <Grid3X3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Matching Pickles
              </h2>
              {isPlaying && (
                <p className="text-sm text-slate-600 dark:text-slate-400">Moves: {moveCount}</p>
              )}
            </div>
          </div>
          <ScoreDisplay currentScore={score} bestScore={bestScore} />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {cards.map((card) => (
            <MatchingCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={
                !isPlaying ||
                card.isMatched ||
                card.isFlipped ||
                isChecking ||
                (flippedCards.length === 1 && flippedCards[0] === card.id)
              }
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
        {!isPlaying && score === 0 && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">How to Play:</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                Click cards to reveal icons
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                Find matching pairs of icons
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                Match all pairs to complete the game
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">4</span>
                Fewer moves = higher score!
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
