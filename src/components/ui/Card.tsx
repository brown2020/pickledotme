import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
}

const CARD_VARIANTS = {
  default:
    "bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700",
  glass:
    "bg-white/80 backdrop-blur-lg border border-white/20 shadow-xl dark:bg-slate-800/80 dark:border-slate-700/20",
  elevated:
    "bg-white shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50",
} as const;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden",
          CARD_VARIANTS[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-b border-slate-100 dark:border-slate-700",
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold text-slate-900 dark:text-white",
      className
    )}
    {...props}
  >
    {children ?? <span className="sr-only">Card</span>}
  </h3>
));
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
