import { Zap, Grid3X3, Timer, Target, Gauge, Type, LucideIcon } from "lucide-react";

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
  "pickle-pop",
  "reaction-pickle",
  "word-pickle",
] as const;

export type GameId = (typeof GAME_IDS)[number];

/**
 * Game name lookup (for backwards compatibility)
 */
export const GAMES: Record<GameId, string> = {
  "sequence-pickle": "Sequence Pickle",
  "matching-pickles": "Matching Pickles",
  "speed-pickle": "Speed Pickle",
  "pickle-pop": "Pickle Pop",
  "reaction-pickle": "Reaction Pickle",
  "word-pickle": "Word Pickle",
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
    id: "reaction-pickle",
    name: "Reaction Pickle",
    description: "Test your reflexes! Click when the pickle turns green.",
    difficulty: "easy",
    icon: Gauge,
    gradient: "from-cyan-500 to-blue-500",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    instructions: [
      "Wait for the pickle to turn green",
      "Click as fast as you can when it changes",
      "Don't click too early or you'll get a penalty!",
      "Complete 5 rounds and see your average time",
    ],
    tips: [
      "Stay focused but relaxed",
      "Keep your finger hovering over the button",
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
    id: "pickle-pop",
    name: "Pickle Pop",
    description: "Pop the pickles as they appear! How many can you catch?",
    difficulty: "medium",
    icon: Target,
    gradient: "from-orange-500 to-red-500",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    instructions: [
      "Pickles will pop up randomly on the grid",
      "Click them before they disappear!",
      "Golden pickles are worth 3x points",
      "Don't click the rotten pickles (brown)!",
    ],
    tips: [
      "Keep your eyes moving across the whole grid",
      "Prioritize golden pickles when you see them",
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
  {
    id: "word-pickle",
    name: "Word Pickle",
    description: "Unscramble the pickle-themed words before time runs out!",
    difficulty: "hard",
    icon: Type,
    gradient: "from-pink-500 to-rose-500",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    instructions: [
      "Rearrange the scrambled letters to form a word",
      "Click letters in order to spell the word",
      "Each correct word earns points based on speed",
      "Longer words are worth more points!",
    ],
    tips: [
      "Look for common letter patterns first",
      "All words are related to pickles, food, or games",
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
