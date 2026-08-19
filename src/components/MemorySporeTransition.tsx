"use client";

import React from "react";
import Link from "next/link";
import { Network, Sparkles } from "lucide-react";

interface MemorySporeTransitionProps {
  isVisible: boolean;
  emotionName?: string;
}

export default function MemorySporeTransition({
  isVisible,
  emotionName = "Memory",
}: MemorySporeTransitionProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto animate-fade-in">
      <Link
        href="/memory-tree"
        className="flex items-center gap-2.5 rounded-full border border-cyan-300/40 bg-[#030728]/85 px-5 py-2 text-xs sm:text-sm font-semibold text-cyan-200 shadow-[0_0_20px_rgba(103,232,249,0.35)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:bg-[#030728]"
      >
        <Sparkles size={15} className="text-amber-300 animate-spin" />
        <span>{emotionName} rooted in your Memory Tree</span>
        <Network size={16} className="text-cyan-400 ml-1" />
      </Link>
    </div>
  );
}
