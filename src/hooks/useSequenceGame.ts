import { useState, useCallback } from "react";
import { useGameBase } from "./useGameBase";

const GAME_ID = "sequence-pickle" as const;
const SEQUENCE_SHOW_DELAY = 500;
const SEQUENCE_HIGHLIGHT_DURATION = 600;
const SEQUENCE_PAUSE_DURATION = 400;

export function useSequenceGame() {
  const gameBase = useGameBase(GAME_ID);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);

  const showSequence = useCallback(async (seq: number[]) => {
    setIsShowingSequence(true);
    setPlayerSequence([]);

    await new Promise((resolve) => setTimeout(resolve, SEQUENCE_SHOW_DELAY));

    for (let i = 0; i < seq.length; i++) {
      setPlayerSequence([seq[i]]);
      await new Promise((resolve) =>
        setTimeout(resolve, SEQUENCE_HIGHLIGHT_DURATION)
      );
      setPlayerSequence([]);
      await new Promise((resolve) =>
        setTimeout(resolve, SEQUENCE_PAUSE_DURATION)
      );
    }
    setIsShowingSequence(false);
  }, []);

  const handleGameOver = useCallback(async () => {
    setPlayerSequence([]);
    await gameBase.endGame();
  }, [gameBase]);

  const startGame = useCallback(async () => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    gameBase.startGame();
    await showSequence(newSequence);
  }, [gameBase, showSequence]);

  const handleColorClick = useCallback(
    async (colorIndex: number) => {
      if (!gameBase.isPlaying || isShowingSequence) return;

      const newPlayerSequence = [...playerSequence, colorIndex];
      setPlayerSequence(newPlayerSequence);

      // Check if player made a mistake
      for (let i = 0; i < newPlayerSequence.length; i++) {
        if (newPlayerSequence[i] !== sequence[i]) {
          await handleGameOver();
          return;
        }
      }

      // Check if player completed the sequence
      if (newPlayerSequence.length === sequence.length) {
        const newScore = gameBase.score + gameBase.level * 100;
        gameBase.updateScore(newScore);
        gameBase.setLevel(gameBase.level + 1);

        // Save score if it's a new best
        if (newScore > gameBase.bestScore) {
          await gameBase.saveScore(newScore);
        }

        // Add new color to sequence
        const newSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(newSequence);
        setPlayerSequence([]);
        await showSequence(newSequence);
      }
    },
    [gameBase, playerSequence, sequence, isShowingSequence, handleGameOver, showSequence]
  );

  const resetGame = useCallback(() => {
    setSequence([]);
    setPlayerSequence([]);
    setIsShowingSequence(false);
    gameBase.resetGame();
  }, [gameBase]);

  return {
    sequence,
    playerSequence,
    isPlaying: gameBase.isPlaying,
    isShowingSequence,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    level: gameBase.level,
    startGame,
    handleColorClick,
    resetGame,
  };
}
