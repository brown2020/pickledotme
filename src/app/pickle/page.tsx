"use client";

import { useState } from "react";
import { readStreamableValue } from "@ai-sdk/rsc";
import Image from "next/image";
import { User } from "lucide-react";
import { getAdvice } from "@/actions/getAdvice";
import { useAuth } from "@/providers/AuthProvider";
import { AuthGuard } from "@/components/AuthGuard";
import { AdviceForm } from "@/components/pickle/AdviceForm";
import { AdviceDisplay } from "@/components/pickle/AdviceDisplay";
import { PickleLayout } from "@/components/pickle/PickleLayout";

function PickleContent() {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (dilemma: string) => {
    if (!user) return;

    setIsLoading(true);
    setAdvice("");
    setError(null);

    try {
      const adviceStream = await getAdvice(dilemma, user.uid);
      for await (const chunk of readStreamableValue(adviceStream)) {
        if (chunk) {
          setAdvice(chunk);
        }
      }
    } catch (err) {
      console.error("Error fetching advice:", err);
      setError("There was an error getting advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PickleLayout>
      {/* User Info */}
      {user && (
        <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 rounded-xl">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || "User"}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-emerald-500/20"
            />
          ) : (
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
          )}
          <div>
            <p className="text-sm text-slate-500">Getting advice as</p>
            <p className="font-semibold text-slate-900">{user.displayName}</p>
          </div>
        </div>
      )}

      <AdviceForm onSubmit={handleSubmit} isLoading={isLoading} />
      
      {error && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
          {error}
        </div>
      )}
      
      <AdviceDisplay advice={advice} />
    </PickleLayout>
  );
}

export default function PicklePage() {
  return (
    <AuthGuard>
      <PickleContent />
    </AuthGuard>
  );
}
