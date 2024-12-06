// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Brain, MessageSquare, Gamepad2 } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import FeatureCard from "@/components/home/FeatureCard";
import HowItWorksSection from "@/components/home/HowItWorksSection";

const features = [
  {
    icon: <MessageSquare className="w-8 h-8 text-green-500" />,
    title: "AI Advice",
    description:
      "Get thoughtful, actionable advice for any dilemma you're facing",
    link: "/pickle",
  },
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "Memory Games",
    description: "Train your brain with fun, pickle-themed memory challenges",
    link: "/games",
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-purple-500" />,
    title: "Track Progress",
    description: "Monitor your performance and compete on the leaderboard",
    link: "/profile",
  },
] as const;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <HeroSection user={user} />

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} showLink={!!user} />
          ))}
        </div>

        <HowItWorksSection />
      </div>
    </div>
  );
}
