interface ProfileCardProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileCard({ title, children }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
      {children}
    </div>
  );
}
