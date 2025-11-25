"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  gradient: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  link,
  gradient,
}: FeatureCardProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Gradient accent */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />
      
      <div className="p-6">
        <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 mb-4 leading-relaxed">{description}</p>
        
        {isAuthenticated && (
          <Link
            href={link}
            className={`inline-flex items-center font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:gap-2 transition-all`}
          >
            Try it out
            <ArrowRight className="ml-1 w-4 h-4 text-current opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        )}
      </div>
    </div>
  );
}
