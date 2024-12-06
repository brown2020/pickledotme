import { GAMES } from "@/constants/games";
import { GameScore } from "@/hooks/useUserScores";
import { ProfileCard } from "./ProfileCard";

interface RecentActivityProps {
  scores: GameScore[];
}

export function RecentActivity({ scores }: RecentActivityProps) {
  return (
    <ProfileCard title="Recent Activity">
      <div className="space-y-4">
        {[...scores]
          .sort(
            (a, b) =>
              b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
          )
          .slice(0, 5)
          .map((score, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg px-4"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {GAMES[score.gameId as keyof typeof GAMES]}
                </p>
                <p className="text-sm text-gray-600">
                  {score.timestamp.toDate().toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span className="text-lg font-semibold text-green-600">
                {score.score.toLocaleString()}
              </span>
            </div>
          ))}

        {scores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No games played yet. Start playing to see your activity!
            </p>
          </div>
        )}
      </div>
    </ProfileCard>
  );
}
