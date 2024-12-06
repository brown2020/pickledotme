import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface AdviceDisplayProps {
  advice: string;
}

export default function AdviceDisplay({ advice }: AdviceDisplayProps) {
  if (!advice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mt-8 bg-white rounded-lg border-2 border-green-100 shadow-lg overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
          <h2 className="text-2xl font-semibold text-green-800">
            🤖 AI Advice
          </h2>
          <p className="text-sm text-green-600 mt-1">
            Personalized guidance for your situation
          </p>
        </div>
        <div className="p-6">
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
                  <p
                    className="mb-4 text-gray-700 leading-relaxed"
                    {...props}
                  />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="text-gray-700" {...props} />
                ),
              }}
            >
              {advice}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
