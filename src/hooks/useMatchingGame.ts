import { useState } from "react";
import { Card } from "@/types/matching-game";
import { ALL_ICONS } from "@/types/matching-game";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export function useMatchingGame() {
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
    const gameIcons = getRandomIcons(8);
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

  return {
    cards,
    isPlaying,
    score,
    bestScore,
    moveCount,
    isChecking,
    flippedCards,
    startGame,
    handleCardClick,
  };
}
