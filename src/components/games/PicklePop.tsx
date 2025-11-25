"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePicklePopGame, PopPickle } from "@/hooks/usePicklePopGame";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { Card, CardContent, CardHeader } from "@/components/ui";
import { Target, Flame, Clock } from "lucide-react";

function PickleButton({ pickle, onClick }: { pickle: PopPickle; onClick: () => void }) {
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    const duration = pickle.expiresAt - Date.now();
    const interval = setInterval(() => {
      const remaining = pickle.expiresAt - Date.now();
      setTimeLeft(Math.max(0, (remaining / duration) * 100));
    }, 50);
    return () => clearInterval(interval);
  }, [pickle.expiresAt]);

  const colors = {
    normal: "from-emerald-400 to-emerald-600",
    golden: "from-yellow-400 to-amber-500",
    rotten: "from-stone-500 to-stone-700",
  };

  const shadows = {
    normal: "shadow-emerald-500/30",
    golden: "shadow-yellow-500/40",
    rotten: "shadow-stone-500/30",
  };

  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`
        absolute inset-2 rounded-2xl
        bg-gradient-to-br ${colors[pickle.type]}
        shadow-lg ${shadows[pickle.type]}
        flex items-center justify-center
        cursor-pointer transition-shadow
        hover:shadow-xl
      `}
    >
      <span className="text-4xl select-none">
        {pickle.type === "golden" ? "✨🥒✨" : pickle.type === "rotten" ? "🥴" : "🥒"}
      </span>

      <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/20 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${pickle.type === "golden" ? "bg-yellow-300" : "bg-white/60"}`}
          initial={{ width: "100%" }}
          animate={{ width: `${timeLeft}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.button>
  );
}

export function PicklePop() {
  const {
    pickles,
    isPlaying,
    score,
    bestScore,
    level,
    timeLeft,
    combo,
    maxCombo,
    startGame,
    handlePickleClick,
  } = usePicklePopGame();

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto dark:bg-slate-800">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pickle Pop</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Level {level}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ScoreDisplay currentScore={score} bestScore={bestScore} />
            {isPlaying && (
              <>
                {combo > 1 && (
                  <div className="text-center px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      <span className="font-bold">{combo}x</span>
                    </div>
                  </div>
                )}
                <div className="text-center px-4 py-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className={`text-2xl font-bold ${timeLeft <= 10 ? "text-rose-600 animate-pulse" : "text-orange-600"}`}>
                    {timeLeft}s
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-3 mb-8 aspect-square max-w-md mx-auto">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="relative aspect-square bg-slate-100 dark:bg-slate-700 rounded-2xl">
              <AnimatePresence>
                {pickles.filter((p) => p.position === index).map((pickle) => (
                  <PickleButton key={pickle.id} pickle={pickle} onClick={() => handlePickleClick(pickle.id)} />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <GameControls onStart={startGame} onReset={startGame} isPlaying={isPlaying} />
          {!isPlaying && score > 0 && (
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600">Final Score: {score}</p>
              <p className="text-sm text-slate-500">Max Combo: {maxCombo}x</p>
            </div>
          )}
        </div>

        {!isPlaying && score === 0 && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">How to Play:</h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">1</span>
                Pickles will pop up randomly on the grid
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">2</span>
                Click them before they disappear!
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">✨🥒✨</span>
                <span>Golden pickles = 3x points</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl">🥴</span>
                <span>Avoid rotten pickles! (-50 points & -2s)</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

