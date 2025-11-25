"use client";

import { motion } from "framer-motion";
import { Brain, MessageSquare, Gamepad2 } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { staggerContainer, staggerItem } from "@/components/PageTransition";

const features = [
  {
    icon: <MessageSquare className="w-8 h-8 text-emerald-500" />,
    title: "AI Advice",
    description:
      "Get thoughtful, actionable advice for any dilemma you're facing",
    link: "/pickle",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Brain className="w-8 h-8 text-blue-500" />,
    title: "Memory Games",
    description: "Train your brain with fun, pickle-themed memory challenges",
    link: "/games",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-violet-500" />,
    title: "Track Progress",
    description: "Monitor your performance and compete on the leaderboard",
    link: "/profile",
    gradient: "from-violet-500 to-purple-500",
  },
] as const;

export function FeatureGrid() {
  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8"
      >
        What can you do?
      </motion.h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={staggerItem}>
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}


