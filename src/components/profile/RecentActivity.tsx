import { GAMES } from "@/constants/games";
import { GameScore } from "@/hooks/useUserScores";
import { ProfileCard } from "./ProfileCard";
import { Clock, Trophy } from "lucide-react";

interface RecentActivityProps {
  scores: GameScore[];
}

export function RecentActivity({ scores }: RecentActivityProps) {
  const sortedScores = [...scores]
    .sort(
      (a, b) =>
        b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
    )
    .slice(0, 5);

  return (
    <ProfileCard title="Recent Activity">
      {sortedScores.length > 0 ? (
        <div className="space-y-3">
          {sortedScores.map((score, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {GAMES[score.gameId as keyof typeof GAMES]}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {score.timestamp.toDate().toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-emerald-600">
                {score.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">
            No games played yet. Start playing to see your activity!
          </p>
        </div>
      )}
    </ProfileCard>
  );
}
