"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { GameId } from "@/config/games";
import { scaleIn } from "@/components/PageTransition";
import { PageBackground } from "@/components/layout/page/PageBackground";

const gameComponents: Record<GameId, React.ComponentType> = {
  "sequence-pickle": dynamic(
    () =>
      import("@/components/games/SequencePickle").then((m) => m.SequencePickle),
    { ssr: false }
  ),
  "matching-pickles": dynamic(
    () =>
      import("@/components/games/MatchingPickles").then(
        (m) => m.MatchingPickles
      ),
    { ssr: false }
  ),
  "speed-pickle": dynamic(
    () => import("@/components/games/SpeedPickle").then((m) => m.SpeedPickle),
    { ssr: false }
  ),
  "pickle-pop": dynamic(
    () => import("@/components/games/PicklePop").then((m) => m.PicklePop),
    { ssr: false }
  ),
  "reaction-pickle": dynamic(
    () =>
      import("@/components/games/ReactionPickle").then((m) => m.ReactionPickle),
    { ssr: false }
  ),
  "word-pickle": dynamic(
    () => import("@/components/games/WordPickle").then((m) => m.WordPickle),
    { ssr: false }
  ),
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
    <PageBackground variant="default-with-padding" className="py-8">
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
    </PageBackground>
  );
}
