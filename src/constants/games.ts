// src/constants/games.ts
export const GAMES = {
  "sequence-pickle": "Sequence Pickle",
  "matching-pickles": "Matching Pickles",
  "speed-pickle": "Speed Pickle",
} as const;

export type GameId = keyof typeof GAMES;
