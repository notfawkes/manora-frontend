"use client";

import React, { useState } from "react";
import Image from "next/image";
import MemoryTreeGroup from "@/components/MemoryTreeGroup";
import MemorySidebar from "@/components/MemorySidebar";
import { memoryTreeData } from "./data";

export default function MemoryTreePage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleSelectNode = (nodeId: string) => {
    // If user clicks the currently selected flower, toggle it; otherwise select the new one
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleCloseSidebar = () => {
    setSelectedNodeId(null);
  };

  const selectedData = selectedNodeId ? memoryTreeData[selectedNodeId] || null : null;
  const isSidebarOpen = Boolean(selectedNodeId && selectedData);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#241F35]">
      {/* Atmospheric Cloud Background */}
      <Image
        src="/images/background.png"
        alt="Atmospheric Background"
        fill
        priority
        className="object-cover object-center pointer-events-none select-none"
      />

      {/* Subtle Twilight Gradient Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#100720]/80 pointer-events-none" />

      {/* Main Content Area - Smoothly shrinks when right sidebar opens */}
      <div
        className={`relative z-10 flex min-h-screen flex-col justify-between px-4 pt-16 pb-8 md:pl-64 md:pt-10 md:pb-10 transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "md:pr-[460px] lg:pr-[480px]" : "md:pr-8"
        }`}
      >
        {/* Top Header spacer / optional breadcrumb */}
        <div className="h-6 flex items-center justify-between" />

        {/* Center Memory Tree Group with fixed aspect ratio */}
        <div className="relative my-auto flex w-full flex-col items-center justify-center transition-all duration-500 ease-in-out">
          <MemoryTreeGroup
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
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
        data={selectedData}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
    </main>
  );
}
