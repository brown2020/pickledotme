"use client";

import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AdviceDisplayProps {
  advice: string;
}

export function AdviceDisplay({ advice }: AdviceDisplayProps) {
  if (!advice) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-8"
    >
      <div className="bg-white rounded-2xl border-2 border-emerald-100 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">AI Advice</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Personalized guidance for your situation
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700">
            <ReactMarkdown
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className="text-2xl font-bold mb-4 text-slate-900"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-xl font-semibold mb-3 text-slate-900"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-lg font-semibold mb-2 text-slate-900"
                    {...props}
                  />
                ),
                p: ({ ...props }) => (
                  <p
                    className="mb-4 text-slate-700 leading-relaxed"
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
                  <li className="text-slate-700" {...props} />
                ),
                strong: ({ ...props }) => (
                  <strong className="font-semibold text-slate-900" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 my-4"
                    {...props}
                  />
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
