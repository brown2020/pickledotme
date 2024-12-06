export default function HowItWorksSection() {
  return (
    <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-green-500">
        How It Works:
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">AI Advice</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Sign in with your Google account</li>
            <li>Describe your current dilemma</li>
            <li>Get personalized, thoughtful advice</li>
            <li>Take action with confidence</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Memory Games</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Choose from various pickle-themed games</li>
            <li>Challenge yourself with increasing difficulty</li>
            <li>Track your high scores and progress</li>
            <li>Compete with other players</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
