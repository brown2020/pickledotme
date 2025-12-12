import { cn } from "@/lib/cn";

const DEFAULT_BG =
  "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950";

export function PageBackground({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "default-with-padding";
}) {
  return (
    <div
      className={cn(
        DEFAULT_BG,
        variant === "default-with-padding" && "py-12 px-4",
        className
      )}
    >
      {children}
    </div>
  );
}
