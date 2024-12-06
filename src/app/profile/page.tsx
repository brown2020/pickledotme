// src/app/profile/page.tsx
"use client";

import { GameStatistics } from "@/components/profile/GameStatistics";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { useUserScores } from "@/hooks/useUserScores";

export default function ProfilePage() {
  const { scores, isLoading } = useUserScores();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-green-600 mb-8 text-center">
        Your Profile
      </h1>
      <div className="space-y-8">
        <GameStatistics scores={scores} />
        <RecentActivity scores={scores} />
      </div>
    </div>
  );
}
