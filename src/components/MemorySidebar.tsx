"use client";

import React, { useState } from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { MemoryNodeData } from "@/app/(app)/memory-tree/data";
import TrophyGoal from "@/components/TrophyGoal";

interface MemorySidebarProps {
  data: MemoryNodeData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemorySidebar({
  data,
  isOpen,
  onClose,
}: MemorySidebarProps) {
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectionText, setReflectionText] = useState("");
  const [hasReflected, setHasReflected] = useState(false);

  if (!data) return null;

  const handleReflectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;
    setHasReflected(true);
    setTimeout(() => {
      setIsReflecting(false);
      setHasReflected(false);
      setReflectionText("");
    }, 1800);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs transition-opacity duration-500 md:hidden"
        />
      )}

      {/* Right Drawer Panel */}
      <aside
        className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-full flex-col justify-between overflow-y-auto bg-[#030728] px-6 py-8 text-white shadow-2xl transition-all duration-500 ease-in-out sm:w-[440px] md:w-[460px] lg:w-[480px] ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 sm:gap-7">
          {/* Header with Title and Close Button */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {data.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close memory details"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stats Card */}
          <div className="flex flex-col gap-3 rounded-2xl sm:rounded-3xl bg-[#ECE4D8] p-5 sm:p-6 text-[#1F1A17] shadow-lg">
            <div className="flex items-center justify-between text-sm sm:text-base font-bold">
              <span className="text-[#302824]">Frequency:</span>
              <span className="text-[#100C09]">{data.frequency}</span>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base font-bold">
              <span className="text-[#302824]">Average Intensity:</span>
              <span className="text-[#100C09]">{data.averageIntensity}</span>
            </div>
            <div className="flex items-center justify-between text-sm sm:text-base font-bold">
              <span className="text-[#302824]">Recent experience:</span>
              <span className="text-[#100C09]">{data.recentExperience}</span>
            </div>
          </div>

          {/* Contexts Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Contexts:
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {data.contexts.map((context, index) => (
                <span
                  key={`${context}-${index}`}
                  className="rounded-xl bg-[#0052B4] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#004494] cursor-default"
                >
                  {context}
                </span>
              ))}
            </div>
          </div>

          {/* Goals Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Goals:
            </h3>
            <div className="flex items-end justify-start gap-4 sm:gap-6 pt-1">
              {data.goals.map((goal) => (
                <TrophyGoal key={goal.id} title={goal.title} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer / Action Area */}
        <div className="mt-8 flex items-center justify-end pt-4">
          <button
            type="button"
            onClick={() => setIsReflecting(true)}
            className="flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-lg font-bold text-[#100C09] shadow-xl transition-all duration-200 hover:scale-105 hover:bg-neutral-100 active:scale-95"
          >
            Reflect
          </button>
        </div>

        {/* Interactive Reflection Modal Overlay */}
        {isReflecting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md rounded-3xl bg-[#0A1138] border border-white/20 p-6 text-white shadow-2xl">
              <button
                type="button"
                onClick={() => setIsReflecting(false)}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="text-amber-400" size={22} />
                <h4 className="text-xl font-bold text-white">
                  Reflect on {data.category}
                </h4>
              </div>

              {hasReflected ? (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    <Check size={28} />
                  </div>
                  <p className="text-base font-semibold text-emerald-200">
                    Reflection logged to your Memory Tree!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReflectSubmit} className="flex flex-col gap-4">
                  <p className="text-xs sm:text-sm text-white/70">
                    What triggered this memory and what helps you grow from it?
                  </p>
                  <textarea
                    rows={4}
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="w-full rounded-2xl border border-white/20 bg-white/10 p-3.5 text-sm text-white placeholder:text-white/40 focus:border-white/50 focus:bg-white/15 focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsReflecting(false)}
                      className="rounded-xl px-4 py-2 text-sm font-semibold text-white/70 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!reflectionText.trim()}
                      className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-2 text-sm font-bold text-[#030728] shadow-md hover:bg-neutral-100 disabled:opacity-40"
                    >
                      <span>Save</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
