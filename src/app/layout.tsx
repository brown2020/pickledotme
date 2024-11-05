// src/app/layout.tsx
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pickle.me - AI Advice & Memory Games",
  description:
    "Get unstuck with AI-powered advice and train your brain with fun pickle-themed memory games!",
  keywords: "AI advice, memory games, problem solving, brain training",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Add class for gradient background that was in your original pages */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
