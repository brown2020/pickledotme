import { User } from "firebase/auth";
import Link from "next/link";
import Auth from "@/components/Auth";

interface HeroSectionProps {
  user: User | null;
}

export default function HeroSection({ user }: HeroSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
      <h1 className="text-4xl font-bold mb-6 text-green-600">
        Welcome to Pickle.me!
      </h1>
      <p className="text-lg mb-6 text-gray-700">
        Your all-in-one platform for problem-solving and brain training. Get
        AI-powered advice when you&apos;re in a pickle, and keep your mind sharp
        with our memory games.
      </p>

      <div className="mb-6">
        <Auth userId={user?.uid || null} />
      </div>

      {user ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Welcome back,{" "}
            <span className="font-semibold">{user.displayName}</span>!
          </p>
          <div className="flex gap-4">
            <Link
              href="/pickle"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Get Advice
            </Link>
            <Link
              href="/games"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Play Games
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">
          Sign in to get started with all our features!
        </p>
      )}
    </div>
  );
}
