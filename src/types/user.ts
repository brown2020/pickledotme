import { GameStats } from "./game";

// src/types/user.ts
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  gameStats: {
    [gameId: string]: GameStats;
  };
  createdAt: Date;
  lastLogin: Date;
}

export interface UserGameScore {
  gameId: string;
  score: number;
  timestamp: Date;
  level: number;
}
