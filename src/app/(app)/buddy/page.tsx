"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, AlertCircle, Loader2 } from "lucide-react";
import BuddyMorphFace from "@/components/BuddyMorphFace";
import { BuddyExpression, InteractionResponse } from "@/types/interaction";
import { resolveBuddyExpression, sendInteraction } from "@/lib/api/interaction";

export default function Buddy() {
  const [message, setMessage] = useState("");
  const [expression, setExpression] = useState<BuddyExpression>("neutral");
  const [buddyIntensity, setBuddyIntensity] = useState<number>(0.65);
  const [displayText, setDisplayText] = useState<string>(
    "Hello Bala, How was your day?"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = message.trim();

    if (!userText || isLoading) return;

    // Increment request ID so older pending requests are ignored if overtaken
    const currentRequestId = ++latestRequestIdRef.current;

    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response: InteractionResponse = await sendInteraction(
        userText,
        controller.signal
      );

      // Discard response if a newer request was sent in the meantime
      if (currentRequestId !== latestRequestIdRef.current) {
        return;
      }

      // Developer debugging log
      if (process.env.NODE_ENV !== "production") {
        console.group("🤖 [Manora Backend Response]");
        console.log("User Emotion:", response.emotion?.primary_emotion);
        console.log("Buddy Expression:", response.buddy?.expression);
        console.log("Buddy Intensity:", response.buddy?.intensity);
        console.log("Buddy State:", response.buddy_state);
        console.log("Buddy Response Text:", response.buddy?.text);
        console.groupEnd();
      }

      // 1. Resolve target expression from backend (primary: buddy.expression, fallback: buddy_state)
      const nextExpression = resolveBuddyExpression(
        response.buddy,
        response.buddy_state
      );

      // 2. Morph Buddy if target expression is different
      if (nextExpression && nextExpression !== expression) {
        setExpression(nextExpression);
      }

      // 3. Store buddy intensity for current and future animation scaling
      if (typeof response.buddy?.intensity === "number") {
        setBuddyIntensity(response.buddy.intensity);
      }

      // 4. Update the greeting/conversation text with Buddy's response
      if (response.buddy?.text) {
        setDisplayText(response.buddy.text);
      }

      setMessage("");
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Request was intentionally aborted for a newer one
        return;
      }

      console.error("Failed to connect with Buddy backend:", err);
      const isConnectionError =
        err instanceof Error &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("ECONNREFUSED"));

      if (isConnectionError) {
        setErrorMessage(
          "Backend is unreachable at http://localhost:8000. Please ensure your FastAPI server is running."
        );
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong while connecting with Buddy.");
      }
    } finally {
      if (currentRequestId === latestRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F2EFE7]">
      {/* Background Image */}
      <Image
        src="/images/background.png"
        alt="Atmospheric Background"
        fill
        priority
        className="object-cover object-center pointer-events-none select-none"
      />

      {/* Vignette Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#1F0B00]/90 pointer-events-none" />

      {/* Main Content Container - responsive margin on md+ for desktop sidebar */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-4 pt-16 pb-8 md:pl-64 md:pt-10 md:pb-10">
        
        {/* Top spacer / subtle status bar */}
        <div className="h-6 flex items-center">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-full bg-red-950/80 px-4 py-1 text-xs text-red-200 backdrop-blur-md border border-red-500/30 animate-fade-in shadow-md">
              <AlertCircle size={14} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Center Character Area (Cloud Buddy + Real SVG Morphed Face) */}
        <div className="relative my-auto flex flex-col items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute h-52 w-52 sm:h-72 sm:w-72 md:h-88 md:w-88 rounded-full bg-[#D9D9D9] blur-[70px] sm:blur-[95px] opacity-75 pointer-events-none animate-pulse" />

          {/* Cloud Buddy Container */}
          <div className="relative h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 lg:h-110 lg:w-110 transition-transform duration-500 hover:scale-105">
            {/* Cloud Body Image */}
            <Image
              src="/images/cloud_buddy.png"
              alt="Buddy Cloud"
              fill
              priority
              className="object-contain pointer-events-none select-none"
            />

            {/* REAL SVG Morphed Expression Face Layer */}
            <div className="absolute left-1/2 top-[44%] w-[38%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <BuddyMorphFace
                expression={expression}
                intensity={buddyIntensity}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Greeting / Backend Response Text & Input */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-5">
          {/* Dynamically driven text from Buddy with smooth subtle transition */}
          <div className="min-h-[64px] flex items-center justify-center px-4">
            <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold leading-snug tracking-tight text-white drop-shadow-md transition-opacity duration-300">
              {displayText}
            </h1>
          </div>

          {/* Responsive Input Form */}
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2 rounded-full border border-white/25 bg-white/15 p-1.5 pl-5 shadow-2xl backdrop-blur-xl transition-all focus-within:border-white/50 focus-within:bg-white/25 focus-within:ring-2 focus-within:ring-white/30"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={isLoading}
              placeholder="Tell Buddy about your day..."
              className="w-full bg-transparent text-sm sm:text-base text-white outline-none placeholder:text-white/60 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              aria-label="Send message to Buddy"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#1F0B00] shadow-md transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin text-[#1F0B00]" />
              ) : (
                <ArrowUp size={20} strokeWidth={2.5} />
              )}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}