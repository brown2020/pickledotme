// src/constants/games.ts
export const GAMES = [
  {
    id: "sequence-pickle",
    name: "Sequence Pickle",
    description: "Test your memory by repeating the pickle pattern!",
    difficulty: "easy",
    instructions: [
      "Watch the sequence of colors",
      "Repeat the sequence by clicking the colors in order",
      "Each correct sequence adds one more color",
      "Score more points in higher levels",
    ],
  },
  {
    id: "matching-pickles",
    name: "Matching Pickles",
    description: "Find matching pairs of pickles before time runs out!",
    difficulty: "medium",
    instructions: [
      "Click tiles to reveal pickles",
      "Find matching pairs",
      "Complete the board before time runs out",
      "Fewer moves = higher score",
    ],
  },
  {
    id: "speed-pickle",
    name: "Speed Pickle",
    description: "How fast can you spot the different pickle?",
    difficulty: "hard",
    instructions: [
      "Find and click the slightly darker pickle",
      "Score points for each correct pick",
      "Level up every 500 points",
      "Higher levels have more pickles and subtle differences",
    ],
  },
] as const;
