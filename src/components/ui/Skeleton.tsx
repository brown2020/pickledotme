import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/80",
        className
      )}
      {...props}
    />
  );
}

function ProfileSkeleton() {
  const statSlots = ["played", "best", "streak"] as const;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {statSlots.map((slot) => (
          <Skeleton key={slot} className="h-24" />
        ))}
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  const rowSlots = ["r1", "r2", "r3", "r4", "r5"] as const;
  return (
    <div className="space-y-3">
      {rowSlots.map((slot) => (
        <div key={slot} className="flex items-center gap-4 p-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, ProfileSkeleton, LeaderboardSkeleton };
