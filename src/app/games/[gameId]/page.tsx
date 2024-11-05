// src/app/games/[gameId]/page.tsx
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

export default function GamePage({ params }: { params: { gameId: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (!user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const GameComponent =
    gameComponents[params.gameId as keyof typeof gameComponents];

  if (!GameComponent) {
    router.push("/games");
    return null;
  }

  return <GameComponent />;
}
