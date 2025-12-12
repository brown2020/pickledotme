import { Suspense } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { PageBackground } from "@/components/layout/page/PageBackground";

export default function Home() {
  return (
    <PageBackground>
      {/* Hero Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-50 dark:opacity-20 pointer-events-none" />

      <div className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <Suspense
            fallback={
              <div className="h-64 bg-white/50 dark:bg-slate-800/50 rounded-3xl animate-pulse" />
            }
          >
            <HeroSection />
          </Suspense>

          {/* Features Grid */}
          <FeatureGrid />

          {/* How It Works */}
          <HowItWorksSection />
        </div>
      </div>
    </PageBackground>
  );
}
