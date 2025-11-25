interface PickleLayoutProps {
  children: React.ReactNode;
}

export function PickleLayout({ children }: PickleLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-emerald-500/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 py-8 px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              🥒 Stuck in a Pickle?
            </h1>
            <p className="text-emerald-100 mt-2">
              Get AI-powered advice for your tricky situations
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
