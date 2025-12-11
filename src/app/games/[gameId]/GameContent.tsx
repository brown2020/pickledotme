"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SequencePickle } from "@/components/games/SequencePickle";
import { MatchingPickles } from "@/components/games/MatchingPickles";
import { SpeedPickle } from "@/components/games/SpeedPickle";
import { PicklePop } from "@/components/games/PicklePop";
import { ReactionPickle } from "@/components/games/ReactionPickle";
import { WordPickle } from "@/components/games/WordPickle";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { GameId } from "@/config/games";
import { scaleIn } from "@/components/PageTransition";

const gameComponents: Record<GameId, React.ComponentType> = {
  "sequence-pickle": SequencePickle,
  "matching-pickles": MatchingPickles,
  "speed-pickle": SpeedPickle,
  "pickle-pop": PicklePop,
  "reaction-pickle": ReactionPickle,
  "word-pickle": WordPickle,
};

interface GameContentProps {
  gameId: GameId;
}

/**
 * Game content - AuthGuard handled by layout
 */
export function GameContent({ gameId }: GameContentProps) {
  const GameComponent = gameComponents[gameId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link href="/games" className="inline-block mb-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
          </Link>
        </motion.div>

        {/* Game Component */}
        <motion.div variants={scaleIn} initial="initial" animate="animate">
          <GameComponent />
        </motion.div>
      </div>
    </div>
  );
}
