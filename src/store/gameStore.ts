// src/store/gameStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { GameStats } from "@/types/game";

interface GameStore {
  scores: {
    [gameId: string]: number;
  };
  gameStats: {
    [gameId: string]: GameStats;
  };
  currentGame: string | null;
  actions: {
    setCurrentGame: (gameId: string | null) => void;
    updateScore: (gameId: string, score: number) => void;
    updateGameStats: (gameId: string, stats: Partial<GameStats>) => void;
    resetGame: (gameId: string) => void;
    resetAllGames: () => void;
  };
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set) => ({
        scores: {},
        gameStats: {},
        currentGame: null,
        actions: {
          setCurrentGame: (gameId) => set({ currentGame: gameId }),

          updateScore: (gameId, score) =>
            set((state) => ({
              scores: {
                ...state.scores,
                [gameId]: Math.max(score, state.scores[gameId] || 0),
              },
            })),

          updateGameStats: (gameId, stats) =>
            set((state) => ({
              gameStats: {
                ...state.gameStats,
                [gameId]: {
                  ...state.gameStats[gameId],
                  ...stats,
                  gamesPlayed: (state.gameStats[gameId]?.gamesPlayed || 0) + 1,
                  lastPlayed: new Date(),
                },
              },
            })),

          resetGame: (gameId) =>
            set((state) => ({
              scores: {
                ...state.scores,
                [gameId]: 0,
              },
              gameStats: {
                ...state.gameStats,
                [gameId]: {
                  gamesPlayed: 0,
                  totalScore: 0,
                  bestScore: 0,
                  lastPlayed: new Date(),
                },
              },
            })),

          resetAllGames: () =>
            set({ scores: {}, gameStats: {}, currentGame: null }),
        },
      }),
      {
        name: "pickle-game-storage",
      }
    )
  )
);
