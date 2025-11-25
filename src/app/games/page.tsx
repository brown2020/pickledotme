import { Metadata } from "next";
import { GamesContent } from "./GamesContent";

export const metadata: Metadata = {
  title: "Memory Games",
  description:
    "Challenge your brain with fun pickle-themed memory games. Play Sequence Pickle, Matching Pickles, and Speed Pickle!",
  openGraph: {
    title: "Memory Games | Pickle.me",
    description: "Challenge your brain with fun pickle-themed memory games!",
  },
};

export default function GamesPage() {
  return <GamesContent />;
}
