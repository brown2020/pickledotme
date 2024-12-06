// src/components/games/MatchingPickles.tsx
"use client";

import { useMatchingGame } from "@/hooks/useMatchingGame";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { MatchingCard } from "./matching/MatchingCard";

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
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-green-600">
            Matching Pickles
          </h2>
          {isPlaying && (
            <p className="text-sm text-gray-600">Moves: {moveCount}</p>
          )}
        </div>
        <ScoreDisplay currentScore={score} bestScore={bestScore} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
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

      <div className="flex justify-between items-center">
        <GameControls
          onStart={startGame}
          onReset={startGame}
          isPlaying={isPlaying}
        />
      </div>

      {!isPlaying && score === 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Click cards to reveal icons</li>
            <li>Find matching pairs of icons</li>
            <li>Match all pairs to complete the game</li>
            <li>Fewer moves = higher score!</li>
          </ul>
        </div>
      )}
    </div>
  );
}
