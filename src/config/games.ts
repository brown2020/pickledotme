import { Zap, Grid3X3, Timer, LucideIcon } from "lucide-react";

/**
 * Game difficulty levels
 */
export type GameDifficulty = "easy" | "medium" | "hard";

/**
 * Complete game configuration
 */
export interface GameConfig {
  id: GameId;
  name: string;
  description: string;
  difficulty: GameDifficulty;
  icon: LucideIcon;
  gradient: string;
  color: string;
  bgColor: string;
  instructions: string[];
  tips: string[];
}

/**
 * All valid game IDs
 */
export const GAME_IDS = [
  "sequence-pickle",
  "matching-pickles",
  "speed-pickle",
] as const;

export type GameId = (typeof GAME_IDS)[number];

/**
 * Game name lookup (for backwards compatibility)
 */
export const GAMES: Record<GameId, string> = {
  "sequence-pickle": "Sequence Pickle",
  "matching-pickles": "Matching Pickles",
  "speed-pickle": "Speed Pickle",
};

/**
 * Difficulty badge styles
 */
export const DIFFICULTY_STYLES: Record<GameDifficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700 ring-emerald-500/20",
  medium: "bg-amber-100 text-amber-700 ring-amber-500/20",
  hard: "bg-rose-100 text-rose-700 ring-rose-500/20",
};

/**
 * Complete game configurations
 */
export const GAME_CONFIGS: GameConfig[] = [
  {
    id: "sequence-pickle",
    name: "Sequence Pickle",
    description: "Remember the pattern of colors and repeat it!",
    difficulty: "easy",
    icon: Zap,
    gradient: "from-emerald-500 to-teal-500",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    instructions: [
      "Watch the sequence of colors flash",
      "Repeat the sequence by clicking the colors",
      "Each round adds one more color",
      "Score more points in higher levels!",
    ],
    tips: [
      "Try humming a tune to remember the sequence",
      "Focus on patterns rather than individual colors",
    ],
  },
  {
    id: "matching-pickles",
    name: "Matching Pickles",
    description: "Find matching pairs of icons before time runs out!",
    difficulty: "medium",
    icon: Grid3X3,
    gradient: "from-blue-500 to-indigo-500",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    instructions: [
      "Click cards to reveal icons",
      "Find matching pairs of icons",
      "Match all pairs to complete the game",
      "Fewer moves = higher score!",
    ],
    tips: [
      "Memorize card positions as you flip them",
      "Start from the corners and work inward",
    ],
  },
  {
    id: "speed-pickle",
    name: "Speed Pickle",
    description: "How fast can you spot the different shade?",
    difficulty: "hard",
    icon: Timer,
    gradient: "from-violet-500 to-purple-500",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    instructions: [
      "Find and click the slightly different pickle",
      "Score points for each correct pick",
      "Level up every 500 points",
      "Gain +1s for correct picks, lose -2s for mistakes",
    ],
    tips: [
      "Scan quickly rather than staring",
      "The difference becomes more subtle at higher levels",
    ],
  },
];

/**
 * Get game config by ID
 */
export function getGameConfig(gameId: GameId): GameConfig | undefined {
  return GAME_CONFIGS.find((game) => game.id === gameId);
}

/**
 * Check if a string is a valid game ID
 */
export function isValidGameId(id: string): id is GameId {
  return GAME_IDS.includes(id as GameId);
}


