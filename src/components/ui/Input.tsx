import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;
    return (
      <div className="w-full">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 transition-[color,background-color,box-shadow,transform,opacity] duration-200",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            error
              ? "border-rose-500 focus:border-rose-500"
              : "border-slate-200 focus:border-emerald-500 dark:border-slate-700 dark:focus:border-emerald-400",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-rose-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const errorId = `${inputId}-error`;
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 transition-[color,background-color,box-shadow,transform,opacity] duration-200 resize-none",
            "bg-white text-slate-900 placeholder:text-slate-400",
            "dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            error
              ? "border-rose-500 focus:border-rose-500"
              : "border-slate-200 focus:border-emerald-500 dark:border-slate-700 dark:focus:border-emerald-400",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-rose-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
