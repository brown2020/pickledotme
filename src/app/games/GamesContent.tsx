"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { Card, CardContent } from "@/components/ui";
import { GAME_CONFIGS, DIFFICULTY_STYLES } from "@/config/games";
import { staggerContainer, staggerItem } from "@/components/PageTransition";

function GamesGrid() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            🎮 Memory Games
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Challenge your brain with fun pickle-themed games. Track your progress
            and compete for high scores!
          </p>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid md:grid-cols-3 gap-6"
        >
          {GAME_CONFIGS.map((game) => {
            const Icon = game.icon;
            return (
              <motion.div key={game.id} variants={staggerItem}>
                <Link href={`/games/${game.id}`} className="group block">
                  <Card
                    variant="elevated"
                    className="h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-slate-800 dark:border-slate-700"
                  >
                    {/* Gradient top accent */}
                    <div className={`h-2 bg-gradient-to-r ${game.gradient}`} />

                    <CardContent className="p-6">
                      {/* Icon */}
                      <div
                        className={`p-4 rounded-2xl ${game.bgColor} ${game.color} w-fit mb-4 group-hover:scale-110 transition-transform dark:bg-opacity-20`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>

                      {/* Title & Description */}
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        {game.name}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {game.description}
                      </p>

                      {/* Difficulty Badge */}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ${
                          DIFFICULTY_STYLES[game.difficulty]
                        }`}
                      >
                        {game.difficulty}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

export function GamesContent() {
  return (
    <AuthGuard>
      <GamesGrid />
    </AuthGuard>
  );
}



