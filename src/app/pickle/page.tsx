"use client";

import { useState } from "react";
import { getAdvice } from "@/actions/getAdvice";
import { readStreamableValue } from "ai/rsc";
import { useAuth } from "@/hooks/useAuth";
import AdviceForm from "@/components/pickle/AdviceForm";
import AdviceDisplay from "@/components/pickle/AdviceDisplay";
import PickleLayout from "@/components/pickle/PickleLayout";
import Image from "next/image";
import { User } from "lucide-react";

export default function PicklePage() {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (dilemma: string) => {
    if (!user) {
      alert("Please sign in to get advice.");
      return;
    }

    setLoading(true);
    setAdvice("");

    try {
      const adviceStream = await getAdvice(dilemma, user.uid);
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
    <PickleLayout>
      {user ? (
        <>
          <div className="flex items-center space-x-2 mb-8 p-4 bg-gray-50 rounded-lg">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <User className="w-10 h-10 text-gray-500" />
            )}
            <div>
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-medium text-gray-900">{user.displayName}</p>
            </div>
          </div>
          <AdviceForm onSubmit={handleSubmit} isLoading={loading} />
          <AdviceDisplay advice={advice} />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">
            Redirecting to the home page...
          </p>
        </div>
      )}
    </PickleLayout>
  );
}
