import { useState, useCallback } from "react";
import { Card, ALL_ICONS } from "@/types/matching-game";
import { useGameBase } from "./useGameBase";

const GAME_ID = "matching-pickles" as const;

export function useMatchingGame() {
  const gameBase = useGameBase(GAME_ID);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const getRandomIcons = useCallback((count: number) => {
    const shuffled = [...ALL_ICONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, []);

  const generateCards = useCallback((): Card[] => {
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
  }, [getRandomIcons]);

  const startGame = useCallback(() => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoveCount(0);
    setIsChecking(false);
    gameBase.startGame();
  }, [generateCards, gameBase]);

  const handleGameComplete = useCallback(
    async (finalScore: number) => {
      gameBase.updateScore(finalScore);
      await gameBase.saveScore(finalScore);
    },
    [gameBase]
  );

  const handleCardClick = useCallback(
    async (cardId: number) => {
      if (!gameBase.isPlaying || isChecking) return;

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
        // Match found
        const newScore = gameBase.score + 100;
        gameBase.updateScore(newScore);

        const matchedCards = newCards.map((card) =>
          card.id === cardId || card.id === flippedCards[0]
            ? { ...card, isMatched: true }
            : card
        );
        setCards(matchedCards);
        setFlippedCards([]);

        // Check if game is complete
        const unmatchedCount = matchedCards.filter((card) => !card.isMatched).length;
        if (unmatchedCount === 0) {
          await handleGameComplete(newScore);
        }
      } else {
        // No match - flip cards back
        setFlippedCards([flippedCards[0], cardId]);
        setIsChecking(true);

        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              !card.isMatched && (card.id === cardId || card.id === flippedCards[0])
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    },
    [gameBase, cards, flippedCards, isChecking, handleGameComplete]
  );

  return {
    cards,
    isPlaying: gameBase.isPlaying,
    score: gameBase.score,
    bestScore: gameBase.bestScore,
    moveCount,
    isChecking,
    flippedCards,
    startGame,
    handleCardClick,
  };
}
