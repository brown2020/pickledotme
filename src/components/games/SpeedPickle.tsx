// src/components/games/SpeedPickle.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

interface Pickle {
  id: number;
  isTarget: boolean;
  shade: number;
}

export function SpeedPickle() {
  const [pickles, setPickles] = useState<Pickle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);

  const handleGameOver = useCallback(async () => {
    setIsPlaying(false);
    const userId = auth.currentUser?.uid;
    if (userId) {
      await setDoc(doc(db, "scores", `speed-${Date.now()}-${userId}`), {
        userId,
        gameId: "speed-pickle",
        score,
        timestamp: new Date(),
      });
    }
  }, [score]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [handleGameOver, isPlaying, timeLeft]);

  const generatePickles = () => {
    const gridSize = Math.min(16 + (level - 1) * 4, 36); // Increases grid size with level, max 36
    const targetIndex = Math.floor(Math.random() * gridSize);
    const targetShade = 500 - (level - 1) * 20; // Makes color difference more subtle with each level
    const regularShade = 400 - (level - 1) * 20;

    return Array.from({ length: gridSize }, (_, index) => ({
      id: index,
      isTarget: index === targetIndex,
      shade: index === targetIndex ? targetShade : regularShade,
    }));
  };

  const startGame = () => {
    setPickles(generatePickles());
    setScore(0);
    setTimeLeft(30);
    setLevel(1);
    setIsPlaying(true);
  };

  const handlePickleClick = async (isTarget: boolean) => {
    if (!isPlaying) return;

    if (isTarget) {
      const newScore = score + 100 * level;
      setScore(newScore);

      // Level up every 5 successful clicks
      if (newScore % 500 === 0) {
        setLevel((prev) => prev + 1);
      }

      if (newScore > bestScore) {
        setBestScore(newScore);
        // Save new high score
        const userId = auth.currentUser?.uid;
        if (userId) {
          await setDoc(doc(db, "scores", `speed-${userId}`), {
            userId,
            gameId: "speed-pickle",
            score: newScore,
            timestamp: new Date(),
          });
        }
      }
      setPickles(generatePickles());

      // Add bonus time for correct picks
      setTimeLeft((prev) => Math.min(prev + 1, 30));
    } else {
      // Penalty for wrong picks
      setScore((prev) => Math.max(0, prev - 25));
      setTimeLeft((prev) => Math.max(0, prev - 2));
    }
  };

  // Function to get grid columns class based on number of pickles
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

      {/* Game Rules */}
      {!isPlaying && score === 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">How to Play:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Find and click the slightly darker pickle</li>
            <li>Score points for each correct pick</li>
            <li>Level up every 500 points</li>
            <li>Higher levels have more pickles and subtle differences</li>
            <li>Gain 1 second for correct picks</li>
            <li>Lose 2 seconds for mistakes</li>
          </ul>
        </div>
      )}
    </div>
  );
}
