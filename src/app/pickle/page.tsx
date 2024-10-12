"use client";

import { useState, useEffect } from "react";
import { getAdvice } from "@/actions/getAdvice";
import { User, onAuthStateChanged } from "firebase/auth"; // Import User type
import { auth } from "@/firebaseConfig"; // Import Firebase auth
import { readStreamableValue } from "ai/rsc"; // Helper for streaming
import ReactMarkdown from "react-markdown"; // Import react-markdown for rendering markdown
import { useRouter } from "next/navigation"; // For redirecting

export default function PicklePage() {
  const [dilemma, setDilemma] = useState("");
  const [advice, setAdvice] = useState<string>(""); // Store advice content
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Specify User type or null
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/"); // Redirect to home if not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      alert("Please sign in to get advice.");
      return;
    }

    setLoading(true);
    setAdvice(""); // Clear previous advice

    try {
      // Call the server action to start streaming the advice
      const adviceStream = await getAdvice(dilemma, user.uid); // Pass the user ID

      // Stream the response and append each chunk as it's received
      for await (const chunk of readStreamableValue(adviceStream)) {
        if (chunk) {
          setAdvice(chunk);
        }
      }
    } catch (error) {
      console.error("Error fetching advice:", error);
      setAdvice("There was an error getting advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-green-600">
          Stuck in a Pickle?
        </h1>

        {user ? (
          <>
            <p className="text-lg mb-4 text-gray-700">
              Logged in as:{" "}
              <span className="font-semibold">{user.displayName}</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="dilemma"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Describe your pickle:
                </label>
                <textarea
                  id="dilemma"
                  value={dilemma}
                  onChange={(e) => setDilemma(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="I'm in a tricky situation..."
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!dilemma || loading}
                className="w-full bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating Advice...
                  </span>
                ) : (
                  "Get Advice"
                )}
              </button>
            </form>

            {advice && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-green-600">
                  AI Advice:
                </h2>
                <div className="prose max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => (
                        <h1
                          className="text-2xl font-bold mb-4 text-gray-800"
                          {...props}
                        />
                      ),
                      h2: ({ ...props }) => (
                        <h2
                          className="text-xl font-semibold mb-3 text-gray-800"
                          {...props}
                        />
                      ),
                      p: ({ ...props }) => (
                        <p className="mb-4 text-gray-700" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-disc pl-5 mb-4" {...props} />
                      ),
                      ol: ({ ...props }) => (
                        <ol className="list-decimal pl-5 mb-4" {...props} />
                      ),
                      li: ({ ...props }) => <li className="mb-2" {...props} />,
                    }}
                  >
                    {advice}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">
              Redirecting to the home page...
            </p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}
