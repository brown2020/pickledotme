import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameConfig, isValidGameId, GAME_IDS } from "@/config/games";
import { GameContent } from "./GameContent";

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

/**
 * Generate static params for all games
 */
export function generateStaticParams() {
  return GAME_IDS.map((gameId) => ({ gameId }));
}

/**
 * Generate metadata for each game page
 */
export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;

  if (!isValidGameId(gameId)) {
    return { title: "Game Not Found" };
  }

  const game = getGameConfig(gameId);
  if (!game) {
    return { title: "Game Not Found" };
  }

  return {
    title: game.name,
    description: game.description,
    openGraph: {
      title: `${game.name} | Pickle.me`,
      description: game.description,
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;

  if (!isValidGameId(gameId)) {
    notFound();
  }

  return <GameContent gameId={gameId} />;
}
