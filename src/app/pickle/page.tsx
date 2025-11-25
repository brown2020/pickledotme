import { Metadata } from "next";
import { PickleContent } from "./PickleContent";

export const metadata: Metadata = {
  title: "Get AI Advice",
  description:
    "Describe your dilemma and get AI-powered advice to help you make better decisions. Thoughtful, actionable guidance when you're stuck in a pickle.",
  openGraph: {
    title: "Get AI Advice | Pickle.me",
    description: "Get AI-powered advice for any dilemma you're facing.",
  },
};

export default function PicklePage() {
  return <PickleContent />;
}
