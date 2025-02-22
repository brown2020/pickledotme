interface PickleLayoutProps {
  children: React.ReactNode;
}

export default function PickleLayout({ children }: PickleLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 via-blue-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-600 py-6 px-8">
            <h1 className="text-4xl font-bold text-white">
              Stuck in a Pickle?
            </h1>
            <p className="text-green-100 mt-2">
              Get AI-powered advice for your tricky situations
            </p>
          </div>
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
