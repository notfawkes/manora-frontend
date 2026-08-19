"use client";

import React from "react";
import Image from "next/image";
import { FlowerCoordinate } from "@/app/(app)/memory-tree/coordinates";

interface FlowerNodeProps {
  coordinate: FlowerCoordinate;
  isSelected: boolean;
  onClick: () => void;
}

export default function FlowerNode({
  coordinate,
  isSelected,
  onClick,
}: FlowerNodeProps) {
  const { x, y, size = 7.5, label } = coordinate;

  return (
    <div
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        height: `${size}%`,
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer select-none group"
      onClick={onClick}
    >
      {/* Selected Halo */}
      {isSelected && (
        <div className="absolute inset-[-25%] rounded-full border-2 border-cyan-300/90 shadow-[0_0_15px_rgba(103,232,249,0.8)] pointer-events-none" />
      )}

      {/* Flower */}
      <button
        type="button"
        aria-label={label}
        className={`relative h-full w-full rounded-full transition-transform duration-300 group-hover:scale-125 focus:outline-none ${
          isSelected ? "scale-125" : ""
        }`}
      >
        <Image
          src="/svg/flower.svg"
          alt="Memory Flower Node"
          fill
          priority
          className="object-contain pointer-events-none"
        />
      </button>

      {/* Hover Tooltip */}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#030728]/90 px-2 py-1 text-[11px] font-semibold text-cyan-200 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:-top-9 group-hover:opacity-100 z-30 border border-cyan-400/30">
        {label}
      </div>
    </div>
  );
}