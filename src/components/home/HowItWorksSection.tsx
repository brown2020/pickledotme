"use client";

import { motion } from "framer-motion";
import { MessageCircle, Brain, Trophy, Lightbulb } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/PageTransition";

const steps = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Describe Your Pickle",
    description: "Tell us about the situation you're facing",
    color: "bg-emerald-500",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Get AI Insights",
    description: "Receive personalized, thoughtful advice",
    color: "bg-blue-500",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Train Your Brain",
    description: "Play memory games to stay sharp",
    color: "bg-violet-500",
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Track Progress",
    description: "Monitor your growth and compete",
    color: "bg-amber-500",
  },
];

export function HowItWorksSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          How It Works
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Get unstuck and sharpen your mind in just a few simple steps
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid md:grid-cols-4 gap-8"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={staggerItem}
            className="relative text-center"
          >
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-slate-200 dark:bg-slate-700" />
            )}

            {/* Step icon */}
            <div
              className={`relative z-10 w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}
            >
              {step.icon}
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center shadow">
                {index + 1}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
