import { useState, useCallback, useEffect, useRef } from "react";
import { useGameBase } from "./useGameBase";
import { useGameTimer } from "./useGameTimer";

const GAME_ID = "word-pickle" as const;
const GAME_DURATION = 60; // seconds
const HINT_PENALTY = 50; // points

// Pickle and food themed words
const WORD_LISTS = {
  easy: [
    "DILL",
    "BRINE",
    "SOUR",
    "JAR",
    "SALT",
    "SNAP",
    "VINE",
    "SEED",
    "CHIP",
    "BITE",
    "ZEST",
    "TANG",
    "CUKE",
    "FARM",
    "PICK",
  ],
  medium: [
    "PICKLE",
    "GHERKIN",
    "GARLIC",
    "FLAVOR",
    "CRUNCH",
    "SNACKS",
    "RECIPE",
    "BARREL",
    "FERMENT",
    "HARVEST",
    "GARDEN",
    "RELISH",
    "KOSHER",
    "SLICED",
    "SPEARS",
  ],
  hard: [
    "CUCUMBER",
    "VINEGAR",
    "PRESERVED",
    "DELICIOUS",
    "CRUNCHY",
    "APPETIZER",
    "HOMEMADE",
    "NATURALLY",
    "BRINING",
    "SEASONED",
    "SANDWICH",
    "NUTRITION",
  ],
};

export interface Letter {
  char: string;
  id: number;
  isSelected: boolean;
  originalIndex: number;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomWord(level: number): string {
  let pool: string[];
  if (level <= 2) pool = WORD_LISTS.easy;
  else if (level <= 4) pool = [...WORD_LISTS.easy, ...WORD_LISTS.medium];
  else pool = [...WORD_LISTS.medium, ...WORD_LISTS.hard];

  return pool[Math.floor(Math.random() * pool.length)];
}

export function useWordGame() {
  const gameBase = useGameBase(GAME_ID);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledLetters, setScrambledLetters] = useState<Letter[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<Letter[]>([]);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use refs to avoid dependency issues in effects
  const levelRef = useRef(gameBase.level);
  levelRef.current = gameBase.level;

  // Use shared timer hook
  const timer = useGameTimer({
    initialTime: GAME_DURATION,
    onTimeUp: () => gameBase.endGame(),
  });

  const generateNewWord = useCallback(() => {
    const word = getRandomWord(levelRef.current);
    setCurrentWord(word);
    setHintUsed(false);
    setShowCorrect(false);
    setIsProcessing(false);

    // Create and shuffle letters
    const letters: Letter[] = word.split("").map((char, index) => ({
      char,
      id: index,
      isSelected: false,
      originalIndex: index,
    }));

    // Keep shuffling until it's different from the original
    let shuffled = shuffleArray(letters);
    while (shuffled.map((l) => l.char).join("") === word && word.length > 2) {
      shuffled = shuffleArray(letters);
    }

    setScrambledLetters(shuffled.map((l, i) => ({ ...l, id: i })));
    setSelectedLetters([]);
  }, []);

  const selectLetter = useCallback(
    (letter: Letter) => {
      if (letter.isSelected || showCorrect || isProcessing) return;

      setScrambledLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, isSelected: true } : l))
      );
      setSelectedLetters((prev) => [...prev, letter]);
    },
    [showCorrect, isProcessing]
  );

  const deselectLetter = useCallback(
    (letter: Letter) => {
      if (showCorrect || isProcessing) return;

      setScrambledLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, isSelected: false } : l))
      );
      setSelectedLetters((prev) => prev.filter((l) => l.id !== letter.id));
    },
    [showCorrect, isProcessing]
  );

  const clearSelection = useCallback(() => {
    if (showCorrect || isProcessing) return;

    setScrambledLetters((prev) =>
      prev.map((l) => ({ ...l, isSelected: false }))
    );
    setSelectedLetters([]);
  }, [showCorrect, isProcessing]);

  const useHint = useCallback(() => {
    if (hintUsed || showCorrect || isProcessing) return;

    setHintUsed(true);
    // Find the next correct letter
    const nextIndex = selectedLetters.length;

    setSelectedLetters((prevSelected) => {
      const nextChar = currentWord[prevSelected.length];

      setScrambledLetters((prevScrambled) => {
        const letterToSelect = prevScrambled.find(
          (l) => !l.isSelected && l.char === nextChar
        );

        if (letterToSelect) {
          return prevScrambled.map((l) =>
            l.id === letterToSelect.id ? { ...l, isSelected: true } : l
          );
        }
        return prevScrambled;
      });

      const letterToAdd = scrambledLetters.find(
        (l) => !l.isSelected && l.char === nextChar
      );

      return letterToAdd ? [...prevSelected, letterToAdd] : prevSelected;
    });
  }, [hintUsed, showCorrect, isProcessing, currentWord, scrambledLetters]);

  // Check if word is complete - using a separate check function
  const checkWord = useCallback(() => {
    if (isProcessing || showCorrect) return;
    if (
      selectedLetters.length !== currentWord.length ||
      currentWord.length === 0
    )
      return;

    const attempt = selectedLetters.map((l) => l.char).join("");

    if (attempt === currentWord) {
      // Correct!
      setIsProcessing(true);
      setShowCorrect(true);

      const basePoints = currentWord.length * 20;
      const timeBonus = Math.floor(timer.timeLeft / 2);
      const hintPenalty = hintUsed ? HINT_PENALTY : 0;
      const points = Math.max(10, basePoints + timeBonus - hintPenalty);

      gameBase.updateScore(gameBase.score + points);

      const newWordsCompleted = wordsCompleted + 1;
      setWordsCompleted(newWordsCompleted);

      // Level up every 3 words
      if (newWordsCompleted % 3 === 0) {
        gameBase.setLevel(gameBase.level + 1);
      }

      // Generate new word after delay
      setTimeout(() => {
        generateNewWord();
      }, 1000);
    } else {
      // Wrong - clear and try again
      setIsProcessing(true);
      setTimeout(() => {
        setScrambledLetters((prev) =>
          prev.map((l) => ({ ...l, isSelected: false }))
        );
        setSelectedLetters([]);
        setIsProcessing(false);
      }, 500);
    }
  }, [
    selectedLetters,
    currentWord,
    timer.timeLeft,
    hintUsed,
    gameBase,
    wordsCompleted,
    generateNewWord,
    isProcessing,
    showCorrect,
  ]);

  // Trigger word check when selection changes
  useEffect(() => {
    if (
      selectedLetters.length === currentWord.length &&
      currentWord.length > 0 &&
      !isProcessing &&
      !showCorrect
    ) {
      checkWord();
    }
  }, [
    selectedLetters.length,
    currentWord.length,
    checkWord,
    isProcessing,
    showCorrect,
  ]);

  const startGame = useCallback(() => {
    setWordsCompleted(0);
    setIsProcessing(false);
    timer.reset();
    timer.start();
    gameBase.startGame();
    generateNewWord();
  }, [gameBase, generateNewWord, timer]);

  const resetGame = useCallback(() => {
    setCurrentWord("");
    setScrambledLetters([]);
    setSelectedLetters([]);
    setWordsCompleted(0);
    setHintUsed(false);
    setShowCorrect(false);
    setIsProcessing(false);
    timer.reset();
    gameBase.resetGame();
  }, [gameBase, timer]);

  return {
    currentWord,
    scrambledLetters,
    selectedLetters,
    timeLeft: timer.timeLeft,
    wordsCompleted,
    hintUsed,
    showCorrect,
    isPlaying: gameBase.isPlaying,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    level: gameBase.level,
    selectLetter,
    deselectLetter,
    clearSelection,
    useHint,
    startGame,
    resetGame,
  };
}
