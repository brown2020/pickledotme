import { useState } from "react";
import LoadingSpinner from "../shared/LoadingSpinner";

interface AdviceFormProps {
  onSubmit: (dilemma: string) => Promise<void>;
  isLoading: boolean;
}

export default function AdviceForm({ onSubmit, isLoading }: AdviceFormProps) {
  const [dilemma, setDilemma] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(dilemma);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-green-50 rounded-lg p-6 border border-green-100">
        <label
          htmlFor="dilemma"
          className="block text-lg font-medium text-green-800 mb-3"
        >
          🥒 Describe your pickle:
        </label>
        <textarea
          id="dilemma"
          value={dilemma}
          onChange={(e) => setDilemma(e.target.value)}
          className="w-full p-4 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400 bg-white"
          placeholder="I'm facing a difficult situation where..."
          rows={5}
          required
        />
        <p className="mt-2 text-sm text-green-600">
          Be specific about your situation for better advice
        </p>
      </div>
      <button
        type="submit"
        disabled={!dilemma.trim() || isLoading}
        className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:bg-gray-400 disabled:hover:transform-none disabled:cursor-not-allowed shadow-md"
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <LoadingSpinner />
            <span>Analyzing your situation...</span>
          </span>
        ) : (
          "Get Expert Advice"
        )}
      </button>
    </form>
  );
}
