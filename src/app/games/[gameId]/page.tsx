"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { SequencePickle } from "@/components/games/SequencePickle";
import { MatchingPickles } from "@/components/games/MatchingPickles";
import { SpeedPickle } from "@/components/games/SpeedPickle";
import { auth } from "@/lib/firebaseConfig";

const gameComponents = {
  "sequence-pickle": SequencePickle,
  "matching-pickles": MatchingPickles,
  "speed-pickle": SpeedPickle,
};

export default function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [gameId, setGameId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Resolve params in a client-safe manner
    async function resolveParams() {
      const resolvedParams = await params;
      setGameId(resolvedParams.gameId);
    }
    resolveParams();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (!user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [params, router]);

  if (isLoading || !gameId) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const GameComponent = gameComponents[gameId as keyof typeof gameComponents];

  if (!GameComponent) {
    router.push("/games");
    return null;
  }

  return <GameComponent />;
}
