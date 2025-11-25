"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { GameStatistics } from "@/components/profile/GameStatistics";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfileSkeleton } from "@/components/ui";
import { useUserScores } from "@/hooks/useUserScores";
import Image from "next/image";
import { User } from "lucide-react";

function ProfileContent() {
  const { user } = useAuth();
  const { scores, isLoading } = useUserScores();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-6">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={80}
                height={80}
                className="rounded-2xl ring-4 ring-emerald-500/20"
              />
            ) : (
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {user?.displayName || "Player"}
              </h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <GameStatistics scores={scores} />

        {/* Recent Activity */}
        <RecentActivity scores={scores} />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
