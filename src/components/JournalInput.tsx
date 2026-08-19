"use client";

import React, { useState, useRef, useEffect } from "react";
import { Brain, Heart } from "lucide-react";

interface JournalInputProps {
  onSubmit: (text: string) => void;
  onTypingChange: (isTyping: boolean) => void;
  isLoading?: boolean;
}

export default function JournalInput({
  onSubmit,
  onTypingChange,
  isLoading = false,
}: JournalInputProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    // Notify parent that user is actively typing
    onTypingChange(true);

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    // Stop active typing animation 1.2s after last keystroke
    typingTimerRef.current = setTimeout(() => {
      onTypingChange(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleShare();
    }
  };

  const handleShare = () => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    onTypingChange(false);
    onSubmit(trimmed);
    setContent("");
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-3 transition-all duration-300">
      {/* Journal Reflection Plate */}
      <div
        className={`relative rounded-3xl border transition-all duration-500 shadow-2xl backdrop-blur-2xl ${
          isFocused
            ? "border-white/45 bg-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "border-white/20 bg-white/12 hover:bg-white/16"
        } p-4 sm:p-5`}
      >
        {/* Top Journal Prompt Hint */}
        <div className="flex items-center justify-between pb-2 text-xs font-semibold tracking-wide text-white/60 select-none">
          <span className="flex items-center gap-1.5">
            <Brain size={13} className="text-amber-200" />
            <span>DAILY REFLECTION</span>
          </span>
          <span className="text-[11px] opacity-70">Press Enter or tap Share</span>
        </div>

        {/* Text Area */}
        <textarea
          rows={2}
          value={content}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onTypingChange(false);
          }}
          disabled={isLoading}
          placeholder="Share your feelings, thoughts, or what happened today..."
          className="w-full bg-transparent text-sm sm:text-base text-white outline-none resize-none placeholder:text-white/45 placeholder:italic leading-relaxed disabled:opacity-50"
        />

        {/* Bottom Tactile Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <span>Buddy listens with heart</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            disabled={!content.trim() || isLoading}
            className="flex items-center gap-2 rounded-2xl bg-white/90 px-5 py-2 text-xs sm:text-sm font-bold text-[#1F0B00] shadow-md transition-all duration-200 hover:scale-105 hover:bg-white active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
          >
            <Heart size={14} className="text-rose-500 fill-rose-500" />
            <span>{isLoading ? "Absorbing..." : "Share with Buddy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
