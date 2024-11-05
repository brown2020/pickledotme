// src/components/games/MatchingPickles.tsx
"use client";

import { useState } from "react";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";
import {
  Apple,
  Banana,
  Cherry,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Leaf,
  Sparkles,
  Crown,
  Trophy,
  Medal,
  Target,
  Gamepad2,
  Bird,
  Fish,
  Bug,
  Gift,
  Rocket,
  Zap,
  Music,
  Phone,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

const ALL_ICONS = [
  Apple,
  Banana,
  Cherry,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Leaf,
  Sparkles,
  Crown,
  Trophy,
  Medal,
  Target,
  Gamepad2,
  Bird,
  Fish,
  Bug,
  Gift,
  Rocket,
  Zap,
  Music,
  Phone,
];

interface Card {
  id: number;
  icon: LucideIcon;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MatchingPickles() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const getRandomIcons = (count: number) => {
    const shuffled = [...ALL_ICONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const generateCards = () => {
    const gameIcons = getRandomIcons(8); // 8 pairs = 16 cards
    const pairs = [...gameIcons, ...gameIcons];
    return pairs
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
  };

  const startGame = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setScore(0);
    setMoveCount(0);
    setIsPlaying(true);
    setIsChecking(false);
  };

  const handleCardClick = async (cardId: number) => {
    if (!isPlaying || isChecking) return;

    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped) return;

    const newCards = cards.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (flippedCards.length === 0) {
      setFlippedCards([cardId]);
      return;
    }

    setMoveCount((prev) => prev + 1);
    const firstCard = cards.find((card) => card.id === flippedCards[0]);

    if (firstCard && firstCard.icon === clickedCard.icon) {
      const newScore = score + 100;
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        const userId = auth.currentUser?.uid;
        if (userId) {
          await setDoc(doc(db, "scores", `matching-${userId}`), {
            userId,
            gameId: "matching-pickles",
            score: newScore,
            timestamp: new Date(),
          });
        }
      }

      setCards(
        newCards.map((card) =>
          card.id === cardId || card.id === flippedCards[0]
            ? { ...card, isMatched: true }
            : card
        )
      );
      setFlippedCards([]);

      if (newCards.filter((card) => !card.isMatched).length <= 2) {
        handleGameComplete(newScore);
      }
    } else {
      setFlippedCards([flippedCards[0], cardId]);
      setIsChecking(true);

      setTimeout(() => {
        setCards(
          newCards.map((card) =>
            !card.isMatched &&
            (card.id === cardId || card.id === flippedCards[0])
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFlippedCards([]);
        setIsChecking(false);
      }, 1000);
    }
  };

  const handleGameComplete = async (finalScore: number) => {
    setIsPlaying(false);
    const userId = auth.currentUser?.uid;
    if (userId) {
      await setDoc(doc(db, "scores", `matching-${Date.now()}-${userId}`), {
        userId,
        gameId: "matching-pickles",
        score: finalScore,
        timestamp: new Date(),
      });
    }
  };

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
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={
                !isPlaying ||
                card.isMatched ||
                card.isFlipped ||
                isChecking ||
                (flippedCards.length === 1 && flippedCards[0] === card.id)
              }
              className={`
                relative h-24 rounded-lg transition-all transform duration-300
                ${
                  card.isMatched
                    ? "bg-green-500"
                    : card.isFlipped
                    ? "bg-blue-500"
                    : "bg-gray-200 hover:bg-gray-300"
                }
                disabled:cursor-not-allowed
                ${card.isFlipped || card.isMatched ? "scale-95" : ""}
                flex items-center justify-center
              `}
            >
              <div
                className={`
                  transition-all duration-300
                  ${
                    card.isFlipped || card.isMatched
                      ? "scale-100 opacity-100"
                      : "scale-0 opacity-0"
                  }
                `}
              >
                {(card.isFlipped || card.isMatched) && (
                  <Icon className="w-8 h-8 text-white" />
                )}
              </div>
            </button>
          );
        })}
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
