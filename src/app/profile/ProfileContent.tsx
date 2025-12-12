"use client";

import Image from "next/image";
import { User, Calendar, Mail } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { GameStatistics } from "@/components/profile/GameStatistics";
import { RecentActivity } from "@/components/profile/RecentActivity";
import { ProfileSkeleton, Card, CardContent } from "@/components/ui";
import { useUserGameScores } from "@/hooks/useScores";
import { PageBackground } from "@/components/layout/page/PageBackground";

/**
 * Profile content - AuthGuard handled by layout
 */
export function ProfileContent() {
  const { user } = useAuth();
  const { scores, isLoading } = useUserGameScores();

  if (isLoading) {
    return (
      <PageBackground variant="default-with-padding">
        <div className="max-w-4xl mx-auto">
          <ProfileSkeleton />
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground variant="default-with-padding">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Profile Header */}
        <Card variant="elevated" className="dark:bg-slate-800">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {user?.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  width={96}
                  height={96}
                  className="rounded-2xl ring-4 ring-emerald-500/20"
                />
              ) : (
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center">
                  <User className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {user?.displayName || "Player"}
                </h1>
                <div className="flex flex-col md:flex-row gap-4 mt-3 text-slate-500 dark:text-slate-400">
                  {user?.email && (
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member since{" "}
                    {user?.metadata?.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div>
          <GameStatistics scores={scores} />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity scores={scores} />
        </div>
      </div>
    </PageBackground>
  );
}
