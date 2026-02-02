import type { Metadata } from "next";
import Link from "next/link";
import { Brain, MessageCircle, Trophy, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Pickle.me",
  description:
    "Learn about Pickle.me - your AI-powered advice platform with brain-training games.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
          About Pickle.me
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Pickle.me helps you navigate life&apos;s tough decisions with
            AI-powered advice while keeping your mind sharp with fun brain
            games.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              What We Do
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <MessageCircle className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  AI Advice
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Get thoughtful guidance from multiple AI models when
                  you&apos;re facing tough decisions. Choose your preferred tone
                  and model for personalized responses.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <Brain className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Brain Games
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Train your cognitive skills with six pickle-themed mini-games.
                  Test your memory, reflexes, and problem-solving abilities.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <Trophy className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Track Progress
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Monitor your improvement with personal bests and compete on
                  leaderboards. Your scores are saved securely to your account.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <Heart className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Privacy First
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Your conversations and data are private. We use secure
                  authentication and never share your personal information.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Our Technology
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Pickle.me is built with modern web technologies to provide a fast,
              reliable experience:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Next.js for a responsive, server-rendered experience</li>
              <li>
                Multiple AI providers (OpenAI, Anthropic, Google, Mistral) for
                diverse perspectives
              </li>
              <li>Firebase for secure authentication and data storage</li>
              <li>Real-time streaming responses for natural conversations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              Open Source
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Pickle.me is open source under the AGPL-3.0 license. We believe in
              transparency and community-driven development.
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Get Started
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
