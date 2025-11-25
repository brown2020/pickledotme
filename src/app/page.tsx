import { Suspense } from "react";
import { Brain, MessageSquare, Gamepad2 } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GameCardSkeleton } from "@/components/ui";

const features = [
  {
    icon: <MessageSquare className="w-8 h-8 text-emerald-500" />,
    title: "AI Advice",
    description:
      "Get thoughtful, actionable advice for any dilemma you're facing",
    link: "/pickle",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "Memory Games",
    description: "Train your brain with fun, pickle-themed memory challenges",
    link: "/games",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-violet-500" />,
    title: "Track Progress",
    description: "Monitor your performance and compete on the leaderboard",
    link: "/profile",
    gradient: "from-violet-500 to-purple-500",
  },
] as const;

function FeatureGridSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <GameCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Hero Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-50 pointer-events-none" />
      
      <div className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section - Client Component for auth */}
          <Suspense fallback={<div className="h-64 bg-white/50 rounded-3xl animate-pulse" />}>
            <HeroSection />
          </Suspense>

          {/* Features Grid */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              What can you do?
            </h2>
            <Suspense fallback={<FeatureGridSkeleton />}>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </Suspense>
          </section>

          {/* How It Works */}
          <HowItWorksSection />
        </div>
      </div>
    </div>
  );
}
