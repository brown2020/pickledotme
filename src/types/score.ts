export interface DisplayScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  timestamp: Date;
  kind?: "history" | "best";
}
