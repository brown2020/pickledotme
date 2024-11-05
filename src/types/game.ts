// src/types/game.ts

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

export type GameDifficulty = "easy" | "medium" | "hard";

export interface Game {
  id: string;
  name: string;
  description: string;
  difficulty: GameDifficulty;
  instructions: string[];
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  lastPlayed: Date;
}
