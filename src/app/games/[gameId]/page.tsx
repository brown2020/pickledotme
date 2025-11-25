"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { SequencePickle } from "@/components/games/SequencePickle";
import { MatchingPickles } from "@/components/games/MatchingPickles";
import { SpeedPickle } from "@/components/games/SpeedPickle";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const gameComponents = {
  "sequence-pickle": SequencePickle,
  "matching-pickles": MatchingPickles,
  "speed-pickle": SpeedPickle,
} as const;

type GameId = keyof typeof gameComponents;

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

function GameContent({ params }: GamePageProps) {
  const [gameId, setGameId] = useState<GameId | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      const id = resolvedParams.gameId as GameId;
      
      if (!(id in gameComponents)) {
        router.push("/games");
        return;
      }
      
      setGameId(id);
    }
    resolveParams();
  }, [params, router]);

  if (!gameId) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const GameComponent = gameComponents[gameId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/games" className="inline-block mb-6">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Games
          </Button>
        </Link>

        {/* Game Component */}
        <GameComponent />
      </div>
    </div>
  );
}

export default function GamePage(props: GamePageProps) {
  return (
    <AuthGuard>
      <GameContent {...props} />
    </AuthGuard>
  );
}
