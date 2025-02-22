// src/app/games/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
