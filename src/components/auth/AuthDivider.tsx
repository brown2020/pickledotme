export function AuthDivider({ label = "or continue with Google" }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-slate-200 dark:border-slate-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
}
