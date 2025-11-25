"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useWordGame, Letter } from "@/hooks/useWordGame";
import { GameControls } from "./common/GameControls";
import { ScoreDisplay } from "./common/ScoreDisplay";
import { Card, CardContent, CardHeader, Button } from "@/components/ui";
import { Type, Clock, Lightbulb, RotateCcw, Check } from "lucide-react";

function LetterTile({
  letter,
  onClick,
  isAnswer = false,
  showCorrect = false,
}: {
  letter: Letter;
  onClick: () => void;
  isAnswer?: boolean;
  showCorrect?: boolean;
}) {
  return (
    <motion.button
      layout
      initial={{ scale: 0, rotate: -10 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        backgroundColor: showCorrect ? "#10b981" : undefined,
      }}
      exit={{ scale: 0, rotate: 10 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={letter.isSelected && !isAnswer}
      className={`
        w-12 h-12 md:w-14 md:h-14 rounded-xl
        font-bold text-xl md:text-2xl
        transition-colors duration-200
        ${
          isAnswer
            ? showCorrect
              ? "bg-emerald-500 text-white"
              : "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
            : letter.isSelected
            ? "bg-slate-300 dark:bg-slate-600 text-slate-400 cursor-not-allowed"
            : "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:shadow-xl"
        }
        flex items-center justify-center
      `}
    >
      {letter.char}
    </motion.button>
  );
}

export function WordPickle() {
  const {
    scrambledLetters,
    selectedLetters,
    timeLeft,
    wordsCompleted,
    hintUsed,
    showCorrect,
    isPlaying,
    score,
    bestScore,
    level,
    selectLetter,
    deselectLetter,
    clearSelection,
    useHint,
    startGame,
    resetGame,
  } = useWordGame();

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto dark:bg-slate-800">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-xl">
              <Type className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Word Pickle
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Level {level} • {wordsCompleted} words
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ScoreDisplay currentScore={score} bestScore={bestScore} />
            {isPlaying && (
              <div className="text-center px-4 py-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <p
                  className={`text-2xl font-bold ${
                    timeLeft <= 10
                      ? "text-rose-600 animate-pulse"
                      : "text-pink-600 dark:text-pink-400"
                  }`}
                >
                  {timeLeft}s
                </p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {isPlaying ? (
          <>
            {/* Answer slots */}
            <div className="mb-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 text-center">
                Tap letters to spell the word:
              </p>
              <div className="flex justify-center gap-2 min-h-[60px] p-4 bg-slate-100 dark:bg-slate-700 rounded-2xl">
                <AnimatePresence mode="popLayout">
                  {selectedLetters.map((letter, index) => (
                    <LetterTile
                      key={`answer-${letter.id}-${index}`}
                      letter={letter}
                      onClick={() => deselectLetter(letter)}
                      isAnswer
                      showCorrect={showCorrect}
                    />
                  ))}
                </AnimatePresence>
                {showCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center ml-2"
                  >
                    <Check className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Scrambled letters */}
            <div className="mb-6">
              <div className="flex justify-center gap-2 flex-wrap">
                <AnimatePresence mode="popLayout">
                  {scrambledLetters.map((letter) => (
                    <LetterTile
                      key={`scrambled-${letter.id}`}
                      letter={letter}
                      onClick={() => selectLetter(letter)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-center gap-3 mb-6">
              <Button
                onClick={clearSelection}
                variant="ghost"
                size="sm"
                disabled={selectedLetters.length === 0 || showCorrect}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
              <Button
                onClick={useHint}
                variant="outline"
                size="sm"
                disabled={hintUsed || showCorrect}
                className="gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Hint {hintUsed ? "(used)" : "(-50pts)"}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Game over or start screen */}
            {score > 0 && (
              <div className="text-center mb-8 p-6 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl">
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Words Completed
                </p>
                <p className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                  {wordsCompleted}
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  Final Score: {score}
                </p>
              </div>
            )}
          </>
        )}

        {/* Controls */}
        <div className="flex justify-center">
          <GameControls
            onStart={startGame}
            onReset={resetGame}
            isPlaying={isPlaying}
          />
        </div>

        {/* Instructions */}
        {!isPlaying && score === 0 && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              How to Play:
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                  1
                </span>
                Rearrange the scrambled letters to form a word
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                  2
                </span>
                Click letters in order to spell the word
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                  3
                </span>
                Faster completion = more points!
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                  4
                </span>
                All words are pickle/food themed 🥒
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

