"use client";

import React from "react";

interface ThoughtCaptionProps {
  text: string;
  isProcessing?: boolean;
}

export default function ThoughtCaption({
  text,
  isProcessing = false,
}: ThoughtCaptionProps) {
  if (!text && !isProcessing) return null;

  return (
    <div className="relative min-h-[48px] max-w-xl flex items-center justify-center px-6 text-center select-none transition-all duration-500">
      {isProcessing ? (
        <div className="flex items-center gap-2 text-white/70 italic text-sm sm:text-base font-medium animate-pulse">
          <span>Buddy is listening and taking it in...</span>
        </div>
      ) : (
        <p className="text-lg sm:text-2xl md:text-[26px] font-semibold leading-relaxed tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-all duration-500">
          {text}
        </p>
      )}
    </div>
  );
}
