import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Pickle.me",
  description: "Terms of Service for Pickle.me - rules and guidelines for using our service.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              By accessing and using Pickle.me, you accept and agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Description of Service
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Pickle.me provides AI-powered advice and brain-training games. The AI advice
              feature uses third-party language models to generate responses to your questions.
              The games are designed for entertainment and cognitive training purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              User Accounts
            </h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>You must sign in with a valid Google account to use our service</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must not share your account with others</li>
              <li>You must be at least 13 years old to use this service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Acceptable Use
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to manipulate game scores or leaderboards</li>
              <li>Use automated tools or bots to interact with the service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Harass, abuse, or harm others through the service</li>
              <li>Upload malicious content or attempt to exploit vulnerabilities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              AI Advice Disclaimer
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              <strong>Important:</strong> The AI advice provided by Pickle.me is for
              informational and entertainment purposes only. It should not be considered:
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Professional medical, legal, financial, or psychological advice</li>
              <li>A substitute for consultation with qualified professionals</li>
              <li>Guaranteed to be accurate, complete, or up-to-date</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              Always consult appropriate professionals for serious matters. We are not
              responsible for decisions made based on AI-generated advice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Intellectual Property
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Pickle.me is open source software licensed under AGPL-3.0. The service name,
              branding, and original content are protected by applicable intellectual property
              laws. User-generated content (conversations, scores) remains your property, but you
              grant us a license to store and process it to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Limitation of Liability
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Pickle.me is provided &quot;as is&quot; without warranties of any kind. We are not
              liable for any damages arising from your use of the service, including but not
              limited to direct, indirect, incidental, or consequential damages. Our total
              liability shall not exceed the amount you paid us (if any) in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Service Availability
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We strive to maintain service availability but do not guarantee uninterrupted
              access. We may modify, suspend, or discontinue features at any time. We will make
              reasonable efforts to notify users of significant changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Termination
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may terminate or suspend your account at any time for violations of these terms
              or for any other reason at our discretion. You may delete your account at any time.
              Upon termination, your right to use the service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Changes to Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We may update these terms from time to time. Continued use of the service after
              changes constitutes acceptance of the new terms. We will notify users of
              significant changes through the service or by email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
              Contact
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              For questions about these terms, please open an issue on our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
