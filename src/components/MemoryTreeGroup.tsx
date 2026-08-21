"use client";

import React from "react";
import Image from "next/image";
import { flowerCoordinates } from "@/app/(app)/memory-tree/coordinates";
import FlowerNode from "@/components/FlowerNode";
import { MemoryNodeResponse } from "@/types/memory-tree";

interface MemoryTreeGroupProps {
  nodes: MemoryNodeResponse[];
  selectedEmotion: string | null;
  onSelectEmotion: (emotion: string) => void;
}

export default function MemoryTreeGroup({
  nodes,
  selectedEmotion,
  onSelectEmotion,
}: MemoryTreeGroupProps) {
  return (
    <div className="relative aspect-square w-full max-w-[min(100%,calc(100vh-140px))] max-h-[calc(100vh-140px)] mx-auto flex items-center justify-center select-none transition-all duration-500 ease-in-out">
      {/* Tree Illustration Image */}
      <Image
        src="/images/memory-tree.png"
        alt="Memory Tree"
        fill
        priority
        className="object-contain pointer-events-none select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      />

      {/* Flower Coordinates Layer */}
      {flowerCoordinates.map((coord) => {
        const nodeData = nodes.find(n => n.emotion === coord.emotion);
        const count = nodeData?.memory_count || 0;
        
        return (
          <FlowerNode
            key={coord.id}
            coordinate={coord}
            isSelected={selectedEmotion === coord.emotion}
            onClick={() => onSelectEmotion(coord.emotion)}
          />
        );
      })}
    </div>
  );
}
