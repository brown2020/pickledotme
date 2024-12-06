import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const SEQUENCE_SHOW_DELAY = 500;
const SEQUENCE_HIGHLIGHT_DURATION = 600;
const SEQUENCE_PAUSE_DURATION = 400;

export function useSequenceGame() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [level, setLevel] = useState(1);

  const showSequence = async (seq: number[]) => {
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

  const startGame = async () => {
    setLevel(1);
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setScore(0);
    setIsPlaying(true);
    await showSequence(newSequence);
  };

  const handleColorClick = async (colorIndex: number) => {
    if (!isPlaying || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, colorIndex];
    setPlayerSequence(newPlayerSequence);

    for (let i = 0; i < newPlayerSequence.length; i++) {
      if (newPlayerSequence[i] !== sequence[i]) {
        await handleGameOver();
        return;
      }
    }

    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + level * 100;
      setScore(newScore);
      setLevel(level + 1);

      if (newScore > bestScore) {
        setBestScore(newScore);
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

      const newSequence = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSequence);
      setPlayerSequence([]);
      await showSequence(newSequence);
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setLevel(1);
    setSequence([]);
    setPlayerSequence([]);
  };

  return {
    sequence,
    playerSequence,
    isPlaying,
    isShowingSequence,
    score,
    bestScore,
    level,
    startGame,
    handleColorClick,
    resetGame,
  };
}
