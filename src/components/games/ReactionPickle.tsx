"use client";

import { motion } from "framer-motion";
import { useReactionGame } from "@/hooks/useReactionGame";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { Card, CardContent, CardHeader, Button } from "@/components/ui";
import { Gauge, Zap, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function ReactionPickle() {
  const {
    phase,
    currentRound,
    totalRounds,
    results,
    currentReactionTime,
    averageTime,
    score,
    bestScore,
    isPlaying,
    startGame,
    resetGame,
    handleClick,
  } = useReactionGame();

  const getPhaseColor = () => {
    switch (phase) {
      case "ready":
        return "from-rose-500 to-red-600";
      case "go":
        return "from-emerald-500 to-green-600";
      case "too-early":
        return "from-amber-500 to-orange-600";
      case "result":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case "waiting":
        return "Click Start to Begin";
      case "ready":
        return "Wait for green...";
      case "go":
        return "CLICK NOW!";
      case "too-early":
        return "Too early! 🙈";
      case "result":
        return `${currentReactionTime}ms`;
      case "finished":
        return "Game Over!";
      default:
        return "";
    }
  };

  const getReactionRating = (time: number) => {
    if (time <= 200) return { text: "Incredible!", color: "text-emerald-500" };
    if (time <= 250) return { text: "Excellent!", color: "text-green-500" };
    if (time <= 300) return { text: "Great!", color: "text-blue-500" };
    if (time <= 400) return { text: "Good", color: "text-cyan-500" };
    if (time <= 500) return { text: "Average", color: "text-amber-500" };
    return { text: "Keep practicing!", color: "text-rose-500" };
  };

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto dark:bg-slate-800">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl">
              <Gauge className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Reaction Pickle
              </h2>
              {isPlaying && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Round {currentRound + 1} of {totalRounds}
                </p>
              )}
            </div>
          </div>
          <ScoreDisplay currentScore={score} bestScore={bestScore} />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Main reaction area */}
        <motion.button
          onClick={handleClick}
          disabled={phase === "waiting" || phase === "finished"}
          className={`
            w-full aspect-[2/1] rounded-3xl mb-6
            bg-gradient-to-br ${getPhaseColor()}
            flex flex-col items-center justify-center
            text-white font-bold
            transition-all duration-200
            disabled:cursor-not-allowed
            ${phase === "go" ? "cursor-pointer" : ""}
            ${phase === "ready" ? "cursor-pointer" : ""}
          `}
          whileTap={phase === "go" || phase === "ready" ? { scale: 0.98 } : {}}
        >
          {phase === "go" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-2"
            >
              <Zap className="w-16 h-16" />
            </motion.div>
          )}
          {phase === "too-early" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-2"
            >
              <AlertTriangle className="w-16 h-16" />
            </motion.div>
          )}
          {phase === "result" && currentReactionTime && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-2"
            >
              {currentReactionTime <= 300 ? (
                <CheckCircle className="w-16 h-16" />
              ) : (
                <Gauge className="w-16 h-16" />
              )}
            </motion.div>
          )}
          
          <span className="text-3xl md:text-4xl">{getPhaseText()}</span>
          
          {phase === "result" && currentReactionTime && (
            <span className={`text-lg mt-2 ${getReactionRating(currentReactionTime).color}`}>
              {getReactionRating(currentReactionTime).text}
            </span>
          )}
        </motion.button>

        {/* Round results */}
        {results.length > 0 && (
          <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Results:
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {results.map((result) => (
                <div
                  key={result.round}
                  className={`text-center p-2 rounded-xl ${
                    result.tooEarly
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  <div className="text-xs opacity-70">R{result.round}</div>
                  <div className="font-bold text-sm">
                    {result.tooEarly ? (
                      <XCircle className="w-4 h-4 mx-auto" />
                    ) : (
                      `${result.reactionTime}ms`
                    )}
                  </div>
                </div>
              ))}
            </div>
            {phase === "finished" && averageTime && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 text-center">
                <p className="text-slate-600 dark:text-slate-400">Average Time</p>
                <p className={`text-3xl font-bold ${getReactionRating(averageTime).color}`}>
                  {averageTime}ms
                </p>
                <p className={`text-lg ${getReactionRating(averageTime).color}`}>
                  {getReactionRating(averageTime).text}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isPlaying ? (
            <Button onClick={startGame} size="lg">
              {phase === "finished" ? "Play Again" : "Start Game"}
            </Button>
          ) : (
            <Button onClick={resetGame} variant="ghost" size="lg">
              Reset
            </Button>
          )}
        </div>

        {/* Instructions */}
        {phase === "waiting" && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              How to Play:
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-sm font-bold">1</span>
                Wait for the box to turn <span className="text-emerald-500 font-bold">GREEN</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-sm font-bold">2</span>
                Click as fast as you can when it changes!
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-sm font-bold">3</span>
                Don&apos;t click while it&apos;s <span className="text-rose-500 font-bold">RED</span> - that&apos;s a penalty!
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 text-sm font-bold">4</span>
                Complete 5 rounds to see your average
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

