"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BuddyMorphFace from "@/components/BuddyMorphFace";
import { BuddyExpression } from "@/types/interaction";

interface BuddyLivingCharacterProps {
  expression: BuddyExpression;
  intensity?: number;
  isTyping?: boolean;
  isProcessing?: boolean;
  onTapBuddy?: () => void;
}

export default function BuddyLivingCharacter({
  expression = "neutral",
  intensity = 0.65,
  isTyping = false,
  isProcessing = false,
  onTapBuddy,
}: BuddyLivingCharacterProps) {
  // Autonomous subtle glance and posture shifts (idle living presence)
  const [glanceOffset, setGlanceOffset] = useState<{ x: number; y: number; rotate: number }>({
    x: 0,
    y: 0,
    rotate: 0,
  });
  const [isTapped, setIsTapped] = useState(false);

  useEffect(() => {
    // Periodic random gentle gaze shift (glancing around the peaceful sky)
    const glanceInterval = setInterval(() => {
      if (isTyping || isProcessing) return;

      const randomGlance = Math.random();
      if (randomGlance > 0.6) {
        // Look slightly left or right
        const xOffset = (Math.random() - 0.5) * 6;
        const yOffset = (Math.random() - 0.5) * 4;
        const rot = (Math.random() - 0.5) * 2.5;
        setGlanceOffset({ x: xOffset, y: yOffset, rotate: rot });

        // Reset gaze after 2.5 seconds
        setTimeout(() => {
          setGlanceOffset({ x: 0, y: 0, rotate: 0 });
        }, 2500);
      }
    }, 7000);

    return () => clearInterval(glanceInterval);
  }, [isTyping, isProcessing]);

  // When user is typing, tilt head attentively toward journal
  const typingTransform = isTyping
    ? "scale(1.04) translateY(4px) rotate(-1.8deg)"
    : "scale(1) translateY(0px) rotate(0deg)";

  const handleTap = () => {
    setIsTapped(true);
    if (onTapBuddy) {
      onTapBuddy();
    }
    setTimeout(() => {
      setIsTapped(false);
    }, 450);
  };

  return (
    <div
      onClick={handleTap}
      title="Buddy (Tap to connect)"
      className="relative flex flex-col items-center justify-center cursor-pointer select-none group"
    >
      {/* Ambient Breathing Glow Aura behind Buddy */}
      <div
        className={`absolute h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none transition-all duration-700 ${
          isProcessing
            ? "bg-cyan-300/40 scale-125 animate-pulse"
            : isTyping
            ? "bg-amber-200/35 scale-110"
            : expression === "happy" || expression === "warmth"
            ? "bg-amber-100/40 animate-ambient-glow"
            : expression === "sad" || expression === "concern"
            ? "bg-blue-300/25 animate-ambient-glow"
            : "bg-[#E6DEC9]/40 animate-ambient-glow"
        }`}
      />

      {/* Floating & Breathing Outer Levitation Layer */}
      <div className="relative animate-buddy-float">
        <div className="relative animate-buddy-breathe">
          {/* Reactive Posture and Tap Squish Container */}
          <div
            style={{
              transform: isTapped
                ? "scale(0.92, 1.08) translateY(-8px)"
                : typingTransform,
              transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-108 lg:w-108 transition-all duration-500"
          >
            {/* Cloud Body Image (Featureless Base) */}
            <Image
              src="/images/cloud_buddy.png"
              alt="Buddy Cloud Body"
              fill
              priority
              className="object-contain pointer-events-none select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.25)]"
            />

            {/* SVG Morphing Expression Face Layer with Organic Glance Shift */}
            <div
              style={{
                transform: `translate(calc(-50% + ${
                  isTyping ? 0 : glanceOffset.x
                }px), calc(-50% + ${
                  isTyping ? 3 : glanceOffset.y
                }px)) rotate(${isTyping ? 0 : glanceOffset.rotate}deg)`,
                transition: "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
              className="absolute left-1/2 top-[44%] w-[38%] z-20 pointer-events-none"
            >
              <BuddyMorphFace expression={expression} intensity={intensity} />
            </div>

            {/* Subtle Attentive Pulse Wave when processing */}
            {isProcessing && (
              <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-30 pointer-events-none" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
