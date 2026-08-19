"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BuddyExpression } from "@/types/interaction";

export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

interface AmbientSkyProps {
  expression?: BuddyExpression;
  forcedTimeOfDay?: TimeOfDay;
}

export default function AmbientSky({
  expression = "neutral",
  forcedTimeOfDay,
}: AmbientSkyProps) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("dusk");

  useEffect(() => {
    if (forcedTimeOfDay) {
      setTimeOfDay(forcedTimeOfDay);
      return;
    }

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) {
      setTimeOfDay("dawn");
    } else if (hour >= 9 && hour < 17) {
      setTimeOfDay("day");
    } else if (hour >= 17 && hour < 20) {
      setTimeOfDay("dusk");
    } else {
      setTimeOfDay("night");
    }
  }, [forcedTimeOfDay]);

  // Mood color tint adjustments
  const getMoodOverlay = () => {
    switch (expression) {
      case "happy":
      case "warmth":
      case "energy":
        return "bg-amber-500/10 mix-blend-soft-light";
      case "sad":
      case "concern":
        return "bg-indigo-900/25 mix-blend-multiply";
      case "frustation":
        return "bg-rose-950/20 mix-blend-overlay";
      default:
        return "bg-transparent";
    }
  };

  // Time of Day sky gradients
  const getSkyGradients = () => {
    switch (timeOfDay) {
      case "dawn":
        return "from-[#382E47]/70 via-[#634E57]/40 to-[#FFC59E]/30";
      case "day":
        return "from-[#4B5578]/50 via-[#798CA8]/30 to-[#F2DFCE]/40";
      case "dusk":
        return "from-[#1F1829]/60 via-[#402C38]/30 to-[#B87C64]/30";
      case "night":
        return "from-[#080712]/90 via-[#12132A]/70 to-[#221833]/60";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Base Atmospheric Painting */}
      <Image
        src="/images/background.png"
        alt="Living Sky Environment"
        fill
        priority
        className="object-cover object-center scale-105 transition-all duration-1000 ease-in-out"
      />

      {/* Dynamic Sky Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${getSkyGradients()} transition-colors duration-1000 ease-in-out`}
      />

      {/* Dynamic Mood Tint Overlay */}
      <div
        className={`absolute inset-0 ${getMoodOverlay()} transition-colors duration-700 ease-in-out`}
      />

      {/* Night / Twilight Starlight Layer */}
      {(timeOfDay === "night" || timeOfDay === "dusk") && (
        <div className="absolute inset-0 opacity-70">
          <div
            className="absolute top-[12%] left-[22%] h-1.5 w-1.5 rounded-full bg-white animate-twinkle"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-[18%] left-[68%] h-2 w-2 rounded-full bg-amber-100 animate-twinkle"
            style={{ animationDelay: "1.2s" }}
          />
          <div
            className="absolute top-[28%] left-[84%] h-1 w-1 rounded-full bg-white animate-twinkle"
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className="absolute top-[15%] left-[45%] h-1.5 w-1.5 rounded-full bg-cyan-100 animate-twinkle"
            style={{ animationDelay: "1.8s" }}
          />
          <div
            className="absolute top-[32%] left-[15%] h-1 w-1 rounded-full bg-rose-100 animate-twinkle"
            style={{ animationDelay: "2.4s" }}
          />
        </div>
      )}

      {/* Horizon Vignette for Deep Immersion */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#10071C]/90" />
    </div>
  );
}
