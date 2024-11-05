// src/components/games/SequencePickle.tsx
"use client";

import { useState } from "react";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

const COLORS = [
  {
    bg: "bg-green-600",
    hover: "hover:bg-green-700",
    active: "bg-green-500",
    base: "bg-green-100",
  },
  {
    bg: "bg-blue-600",
    hover: "hover:bg-blue-700",
    active: "bg-blue-500",
    base: "bg-blue-100",
  },
  {
    bg: "bg-yellow-600",
    hover: "hover:bg-yellow-700",
    active: "bg-yellow-500",
    base: "bg-yellow-100",
  },
  {
    bg: "bg-purple-600",
    hover: "hover:bg-purple-700",
    active: "bg-purple-500",
    base: "bg-purple-100",
  },
];

export function SequencePickle() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState(1);

  const startGame = async () => {
    setLevel(1);
    const newSequence = [Math.floor(Math.random() * COLORS.length)];
    setSequence(newSequence);
    setScore(0);
    setIsPlaying(true);
    await showSequence(newSequence);
  };

  const showSequence = async (seq: number[]) => {
    setIsShowingSequence(true);
    setPlayerSequence([]);

    // Initial pause before showing sequence
    await new Promise((resolve) => setTimeout(resolve, 500));

    for (let i = 0; i < seq.length; i++) {
      setPlayerSequence([seq[i]]);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setPlayerSequence([]);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setIsShowingSequence(false);
  };

  const handleColorClick = async (colorIndex: number) => {
    if (!isPlaying || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    // Check if player's sequence matches the game sequence
    for (let i = 0; i < newPlayerSequence.length; i++) {
      if (newPlayerSequence[i] !== sequence[i]) {
        await handleGameOver();
        return;
      }
    }

    // If player completed the sequence correctly
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + level * 100;
      setScore(newScore);
      setLevel(level + 1);

      if (newScore > bestScore) {
        setBestScore(newScore);
        // Save new high score to Firestore
        const userId = auth.currentUser?.uid;
        if (userId) {
          await setDoc(doc(db, "scores", `sequence-${userId}`), {
            userId,
            gameId: "sequence-pickle",
            score: newScore,
            timestamp: new Date(),
          });
        }
      }

      // Add one more color to the sequence
      const newSequence = [
        ...sequence,
        Math.floor(Math.random() * COLORS.length),
      ];
      setSequence(newSequence);
      setPlayerSequence([]);
      await showSequence(newSequence);
    }
  };

  const handleGameOver = async () => {
    setIsPlaying(false);
    setPlayerSequence([]);
    const userId = auth.currentUser?.uid;
    if (userId) {
      await setDoc(doc(db, "scores", `sequence-${Date.now()}-${userId}`), {
        userId,
        gameId: "sequence-pickle",
        score,
        timestamp: new Date(),
      });
    }
  };

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
        {COLORS.map((color, index) => (
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
          onReset={() => {
            setIsPlaying(false);
            setScore(0);
            setLevel(1);
            setSequence([]);
            setPlayerSequence([]);
          }}
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
