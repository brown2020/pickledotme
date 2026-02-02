import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Pickle.me",
  description: "Privacy Policy for Pickle.me - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Introduction
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Pickle.me (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is
              committed to protecting your personal data. This privacy policy explains how we
              collect, use, and safeguard your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Information We Collect
            </h2>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              Account Information
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              When you sign in with Google, we receive your name, email address, and profile
              picture. We use this to create and manage your account.
            </p>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              Conversation Data
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              When you use our AI advice feature, we store your conversations to provide
              continuity and allow you to revisit past discussions. These conversations are
              private to your account.
            </p>

            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
              Game Scores
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              We store your game scores and personal bests to track your progress and display
              leaderboards. Your username and scores may be visible to other users on
              leaderboards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>To provide and maintain our service</li>
              <li>To personalize your experience</li>
              <li>To save your conversation history and game progress</li>
              <li>To display leaderboards and social features</li>
              <li>To improve our service based on usage patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Third-Party Services
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>
                <strong>Firebase (Google)</strong> - Authentication and database services
              </li>
              <li>
                <strong>AI Providers</strong> (OpenAI, Anthropic, Google, Mistral) - To generate
                advice responses. Your prompts are sent to these services but are not used to
                train their models.
              </li>
              <li>
                <strong>Vercel</strong> - Hosting and analytics
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Data Security
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We implement security measures including encrypted connections (HTTPS), secure
              session cookies, and Firebase security rules to protect your data. However, no
              method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Your Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Access your personal data</li>
              <li>Delete your account and associated data</li>
              <li>Export your conversation history</li>
              <li>Opt out of leaderboards</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Cookies
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We use essential cookies for authentication and session management. We also store
              your theme preference (light/dark mode) locally. We do not use tracking cookies or
              third-party advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Changes to This Policy
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &quot;Last
              updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              If you have questions about this privacy policy, please open an issue on our GitHub
              repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
