"use client";

import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { Card, CardContent } from "@/components/ui";
import { Zap, Grid3X3, Timer } from "lucide-react";

const GAMES = [
  {
    id: "sequence-pickle",
    name: "Sequence Pickle",
    description: "Remember the pattern of colors and repeat it!",
    difficulty: "easy",
    icon: <Zap className="w-8 h-8" />,
    gradient: "from-emerald-500 to-teal-500",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "matching-pickles",
    name: "Matching Pickles",
    description: "Find matching pairs of icons before time runs out!",
    difficulty: "medium",
    icon: <Grid3X3 className="w-8 h-8" />,
    gradient: "from-blue-500 to-indigo-500",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "speed-pickle",
    name: "Speed Pickle",
    description: "How fast can you spot the different shade?",
    difficulty: "hard",
    icon: <Timer className="w-8 h-8" />,
    gradient: "from-violet-500 to-purple-500",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
] as const;

const difficultyBadges = {
  easy: "bg-emerald-100 text-emerald-700 ring-emerald-500/20",
  medium: "bg-amber-100 text-amber-700 ring-amber-500/20",
  hard: "bg-rose-100 text-rose-700 ring-rose-500/20",
};

function GamesContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🎮 Memory Games
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Challenge your brain with fun pickle-themed games. Track your progress
            and compete for high scores!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {GAMES.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id} className="group">
              <Card
                variant="elevated"
                className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Gradient top accent */}
                <div className={`h-2 bg-gradient-to-r ${game.gradient}`} />
                
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className={`p-4 rounded-2xl ${game.bgColor} ${game.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    {game.name}
                  </h2>
                  <p className="text-slate-600 mb-4">{game.description}</p>

                  {/* Difficulty Badge */}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ${
                      difficultyBadges[game.difficulty]
                    }`}
                  >
                    {game.difficulty}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  return (
    <AuthGuard>
      <GamesContent />
    </AuthGuard>
  );
}
