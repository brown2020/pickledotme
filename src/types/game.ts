// src/types/game.ts
// Re-export GameDifficulty from config to avoid duplication
export type { GameDifficulty } from "@/config/games";

export interface GameScore {
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
}

export interface GameState {
  isPlaying: boolean;
  score: number;
  bestScore: number;
  level: number;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  difficulty: import("@/config/games").GameDifficulty;
  instructions: string[];
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  lastPlayed: Date;
}
