import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const BUTTON_VARIANTS = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-700/20 dark:bg-emerald-700 dark:hover:bg-emerald-600",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
  destructive:
    "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
  ghost:
    "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
  outline:
    "border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-950",
} as const;

const BUTTON_SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-semibold rounded-xl transition-[color,background-color,box-shadow,transform,opacity] duration-200",
          "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          "active:scale-[0.98]",
          BUTTON_VARIANTS[variant],
          BUTTON_SIZES[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
