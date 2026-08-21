"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import AmbientSky, { TimeOfDay } from "@/components/AmbientSky";
import BuddyLivingCharacter from "@/components/BuddyLivingCharacter";
import ThoughtCaption from "@/components/ThoughtCaption";
import JournalInput from "@/components/JournalInput";
import MemorySporeTransition from "@/components/MemorySporeTransition";
import { BuddyExpression, InteractionResponse } from "@/types/interaction";
import { resolveBuddyExpression, sendInteraction } from "@/lib/api/interaction";
import { Sun, Moon, Sunrise, Sunset } from "lucide-react";

const DEFAULT_GREETING = "Hello, I'm here with you.";

export default function BuddyPage() {
  const [expression, setExpression] = useState<BuddyExpression>("neutral");
  const [buddyIntensity, setBuddyIntensity] = useState<number>(0.65);
  const [thoughtText, setThoughtText] = useState<string>(DEFAULT_GREETING);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMemorySpore, setShowMemorySpore] = useState(false);
  const [lastRootedEmotion, setLastRootedEmotion] = useState<string>("Memory");
  const [timeOfDayOverride, setTimeOfDayOverride] = useState<TimeOfDay | undefined>(undefined);

  const { data: session } = useSession();
  const sessionIdRef = useRef<string>("");

  const userName = session?.user?.name || "Friend";

  useEffect(() => {
    if (!sessionIdRef.current && typeof window !== "undefined") {
      sessionIdRef.current = crypto.randomUUID();
    }
  }, []);

  useEffect(() => {
    if (session?.user?.name && thoughtText === DEFAULT_GREETING) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThoughtText(`Hello ${session.user.name}, I'm here with you.`);
    }
  }, [session?.user?.name, thoughtText]);

  // Request race-condition safeguard
  const latestRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleShareThought = async (userText: string) => {
    if (!userText || isLoading) return;

    const currentRequestId = ++latestRequestIdRef.current;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const userId = session?.user?.id || "anonymous-user";
      const sessionId = sessionIdRef.current || "fallback-session-id";

      const response: InteractionResponse = await sendInteraction(
        userText,
        userId,
        sessionId,
        controller.signal
      );

      if (currentRequestId !== latestRequestIdRef.current) {
        return;
      }

      // 1. Resolve expression from backend
      const nextExpression = resolveBuddyExpression(
        response.buddy,
        response.buddy_state
      );

      if (nextExpression) {
        setExpression(nextExpression);
      }

      if (typeof response.buddy?.intensity === "number") {
        setBuddyIntensity(response.buddy.intensity);
      }

      // 2. Set spoken thought caption
      if (response.buddy?.text) {
        setThoughtText(response.buddy.text);
      }

      // 3. Trigger Memory Spore transition to Memory Tree
      const emotionLabel =
        response.emotion?.primary_emotion ||
        (nextExpression ? nextExpression.charAt(0).toUpperCase() + nextExpression.slice(1) : "Thought");
      setLastRootedEmotion(emotionLabel);
      setShowMemorySpore(true);
      setTimeout(() => {
        setShowMemorySpore(false);
      }, 4500);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      console.warn("Backend offline, utilizing gentle companion offline presence:", err);
      // Graceful offline companion presence
      const fallbackExpressions: BuddyExpression[] = ["warmth", "happy", "neutral", "concern"];
      const chosenExpr = fallbackExpressions[Math.floor(Math.random() * fallbackExpressions.length)];
      setExpression(chosenExpr);
      setThoughtText("Thank you for sharing that with me. I hold your thoughts close.");
      setLastRootedEmotion("Reflection");
      setShowMemorySpore(true);
      setTimeout(() => {
        setShowMemorySpore(false);
      }, 4500);
    } finally {
      if (currentRequestId === latestRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleTapBuddy = () => {
    // Companion acknowledgement on gentle physical touch
    const tapPhrases = [
      "I'm right here with you.",
      "A quiet moment to just be.",
      "Take a soft breath with me.",
      `You are doing your best, ${userName}.`,
    ];
    const phrase = tapPhrases[Math.floor(Math.random() * tapPhrases.length)];
    setThoughtText(phrase);
    setExpression((prev) => (prev === "happy" ? "warmth" : "happy"));
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#1B1528]">
      {/* Living Atmospheric Sky & Time-of-Day Environment */}
      <AmbientSky expression={expression} forcedTimeOfDay={timeOfDayOverride} />

      {/* Memory Tree Spore Growth Notification */}
      <MemorySporeTransition
        isVisible={showMemorySpore}
        emotionName={lastRootedEmotion}
      />

      {/* Main Living Companion Stage */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 pt-14 pb-8 md:pl-64 md:pt-8 md:pb-8">
        {/* Top Atmosphere Controls & Ambient Status */}
        <div className="w-full flex items-center justify-end max-w-4xl px-2">
          {/* Subtle Time of Day Selector */}
          <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md border border-white/15">
            <button
              type="button"
              onClick={() => setTimeOfDayOverride("dawn")}
              title="Dawn"
              className={`p-1.5 rounded-full transition ${
                timeOfDayOverride === "dawn" ? "bg-white/30 text-amber-200" : "text-white/60 hover:text-white"
              }`}
            >
              <Sunrise size={14} />
            </button>
            <button
              type="button"
              onClick={() => setTimeOfDayOverride("day")}
              title="Daylight"
              className={`p-1.5 rounded-full transition ${
                timeOfDayOverride === "day" ? "bg-white/30 text-yellow-200" : "text-white/60 hover:text-white"
              }`}
            >
              <Sun size={14} />
            </button>
            <button
              type="button"
              onClick={() => setTimeOfDayOverride("dusk")}
              title="Dusk"
              className={`p-1.5 rounded-full transition ${
                timeOfDayOverride === "dusk" ? "bg-white/30 text-rose-200" : "text-white/60 hover:text-white"
              }`}
            >
              <Sunset size={14} />
            </button>
            <button
              type="button"
              onClick={() => setTimeOfDayOverride("night")}
              title="Night"
              className={`p-1.5 rounded-full transition ${
                timeOfDayOverride === "night" ? "bg-white/30 text-cyan-200" : "text-white/60 hover:text-white"
              }`}
            >
              <Moon size={14} />
            </button>
          </div>
        </div>

        {/* Center Stage: Living Character + Spoken Ambient Thought */}
        <div className="my-auto flex flex-col items-center justify-center gap-4 sm:gap-6">
          <BuddyLivingCharacter
            expression={expression}
            intensity={buddyIntensity}
            isTyping={isTyping}
            isProcessing={isLoading}
            onTapBuddy={handleTapBuddy}
          />

          {/* Floating Spoken Thought Caption */}
          <ThoughtCaption text={thoughtText} isProcessing={isLoading} />
        </div>

        {/* Bottom Stage: Tactile Thought Reflection Journal Plate */}
        <div className="w-full max-w-xl pb-2">
          <JournalInput
            onSubmit={handleShareThought}
            onTypingChange={setIsTyping}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  );
}