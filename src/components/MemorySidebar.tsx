"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, BrainCircuit, Loader2 } from "lucide-react";
import { getEmotionMemories, getReflection } from "@/lib/api/memory-tree";
import { EmotionMemoriesResponse, ReflectionResponse } from "@/types/memory-tree";

interface MemorySidebarProps {
  userId: string | undefined;
  emotion: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemorySidebar({
  userId,
  emotion,
  isOpen,
  onClose,
}: MemorySidebarProps) {
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [memoryData, setMemoryData] = useState<EmotionMemoriesResponse | null>(null);

  const [isReflecting, setIsReflecting] = useState(false);
  const [loadingReflection, setLoadingReflection] = useState(false);
  const [reflectionData, setReflectionData] = useState<ReflectionResponse | null>(null);

  useEffect(() => {
    if (isOpen && userId && emotion) {
      loadMemories();
    } else {
      setMemoryData(null);
      setIsReflecting(false);
      setReflectionData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, emotion, userId]);

  const loadMemories = async () => {
    if (!userId || !emotion) return;
    setLoadingMemories(true);
    const data = await getEmotionMemories(userId, emotion);
    setMemoryData(data);
    setLoadingMemories(false);
  };

  const handleReflectClick = async () => {
    setIsReflecting(true);
    setLoadingReflection(true);
    if (userId && emotion) {
      const data = await getReflection(userId, emotion);
      setReflectionData(data);
    }
    setLoadingReflection(false);
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
        className={`fixed right-0 top-0 z-40 flex h-screen w-full max-w-full flex-col overflow-y-auto bg-[#030728] px-6 py-8 text-white shadow-2xl transition-all duration-500 ease-in-out sm:w-[440px] md:w-[460px] lg:w-[480px] custom-scrollbar ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6 sm:gap-7 flex-grow">
          {/* Header */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white capitalize">
              {emotion ? `${emotion} Memories` : ""}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {loadingMemories ? (
            <div className="flex flex-col items-center justify-center py-20 text-blue-400">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p>Unlocking memories...</p>
            </div>
          ) : memoryData ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-lg font-bold text-slate-300 px-2">
                <span>Total Memories</span>
                <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full">{memoryData.memories.length}</span>
              </div>
              
              <div className="flex flex-col gap-4 mt-4 pb-10">
                {memoryData.memories.map((mem) => (
                  <div key={mem.memory_id} className="bg-[#ECE4D8]/10 border border-[#ECE4D8]/20 rounded-2xl p-5 text-slate-200">
                    <p className="leading-relaxed text-sm">{mem.content}</p>
                    <div className="mt-4 flex gap-4 text-xs font-semibold text-slate-400">
                      <span>Importance: {(mem.importance * 100).toFixed(0)}%</span>
                      <span>Confidence: {(mem.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400">
              No memories found.
            </div>
          )}
        </div>

        {/* Footer / Action Area */}
        <div className="mt-8 flex items-center justify-end pt-4 pb-6 sticky bottom-0 bg-[#030728] border-t border-white/10">
          <button
            type="button"
            onClick={handleReflectClick}
            disabled={loadingMemories || !memoryData || memoryData.memories.length === 0}
            className="flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-lg font-bold text-[#100C09] shadow-xl transition-all duration-200 hover:scale-105 hover:bg-neutral-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reflect
            <Sparkles size={18} className="text-amber-500" />
          </button>
        </div>

        {/* Interactive Reflection Modal Overlay */}
        {isReflecting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl bg-[#0A1138] border border-white/20 p-6 md:p-8 text-white shadow-2xl">
              <button
                type="button"
                onClick={() => setIsReflecting(false)}
                className="absolute right-4 top-4 text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="text-amber-400" size={28} />
                <h4 className="text-2xl font-bold text-white capitalize">
                  Reflection
                </h4>
              </div>

              {loadingReflection ? (
                <div className="flex flex-col items-center justify-center py-16 text-amber-400/80">
                  <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-400 rounded-full animate-spin mb-6"></div>
                  <p className="text-lg animate-pulse font-medium">AI is analyzing your memories...</p>
                </div>
              ) : reflectionData ? (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-5">
                    <h5 className="text-indigo-300 font-bold mb-2 uppercase text-xs tracking-wider">Summary</h5>
                    <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                      {reflectionData.reflection.summary}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-emerald-400 font-bold mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
                      <Sparkles size={14} />
                      Contributing Factors
                    </h5>
                    <ul className="flex flex-col gap-3">
                      {reflectionData.reflection.contributing_factors.map((factor, idx) => (
                        <li key={idx} className="flex gap-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl p-4 text-sm text-slate-300 leading-relaxed">
                          <ArrowRight className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-red-400">
                  Failed to load reflection.
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
