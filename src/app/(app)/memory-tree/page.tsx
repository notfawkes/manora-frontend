"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MemoryTreeGroup from "@/components/MemoryTreeGroup";
import MemorySidebar from "@/components/MemorySidebar";
import { getMemoryNodes } from "@/lib/api/memory-tree";
import { MemoryNodeResponse } from "@/types/memory-tree";

export default function MemoryTreePage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [nodes, setNodes] = useState<MemoryNodeResponse[]>([]);

  useEffect(() => {
    if (userId) {
      loadNodes();
    }
  }, [userId]);

  const loadNodes = async () => {
    if (!userId) return;
    const data = await getMemoryNodes(userId);
    setNodes(data);
  };

  const handleSelectEmotion = (emotion: string) => {
    // If user clicks the currently selected flower, toggle it; otherwise select the new one
    setSelectedEmotion((prev) => (prev === emotion ? null : emotion));
  };

  const handleCloseSidebar = () => {
    setSelectedEmotion(null);
  };

  const isSidebarOpen = Boolean(selectedEmotion);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#241F35]">
      {/* Atmospheric Cloud Background */}
      <Image
        src="/images/background.png"
        alt="Atmospheric Background"
        fill
        priority
        className="object-cover object-center pointer-events-none select-none opacity-80"
      />

      {/* Subtle Twilight Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#100720]/80 pointer-events-none" />

      {/* Main Content Area - Smoothly shrinks when right sidebar opens */}
      <div
        className={`relative z-10 flex min-h-screen flex-col justify-between px-4 pt-16 pb-8 md:pl-64 md:pt-10 md:pb-10 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "md:pr-[460px] lg:pr-[480px]" : "md:pr-8"
        }`}
      >
        {/* Top Header spacer */}
        <div className="h-6 flex items-center justify-between" />

        {/* Center Memory Tree Group with fixed aspect ratio */}
        <div className="relative my-auto flex w-full flex-col items-center justify-center transition-all duration-500 ease-in-out">
          <MemoryTreeGroup
            nodes={nodes}
            selectedEmotion={selectedEmotion}
            onSelectEmotion={handleSelectEmotion}
          />
        </div>

        {/* Bottom Instructional Prompt Text */}
        <div className="w-full flex items-center justify-center px-4 transition-all duration-500 ease-in-out">
          <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-all duration-300">
            Click on the nodes to unleash your favourite memories
          </h1>
        </div>
      </div>

      {/* Right Drawer / Sidebar for Selected Memory Node */}
      <MemorySidebar
        userId={userId}
        emotion={selectedEmotion}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
    </main>
  );
}
