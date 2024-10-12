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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stuck in a Pickle?</h1>

      {user ? (
        <>
          <p>Logged in as: {user.displayName}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Describe your pickle here..."
              required
            />
            <button
              type="submit"
              disabled={!dilemma || loading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {loading ? "Generating Advice..." : "Get Advice"}
            </button>
          </form>

          {/* Show the advice once it's available */}
          {advice && (
            <div className="mt-6 bg-gray-100 p-4 rounded">
              <h2 className="text-xl font-semibold mb-5">AI Advice:</h2>
              {/* Use ReactMarkdown to render the markdown content */}
              <ReactMarkdown
                components={{
                  h1: ({ ...props }) => (
                    <h1 className="text-2xl mb-3 font-semibold" {...props} />
                  ),
                  h2: ({ ...props }) => (
                    <h2 className="text-xl mb-3 font-semibold" {...props} />
                  ),
                  p: ({ ...props }) => <p className="mb-5" {...props} />,
                }}
              >
                {advice}
              </ReactMarkdown>
            </div>
          )}
        </>
      ) : (
        <p>Redirecting to the home page...</p>
      )}
    </div>
  );
}
