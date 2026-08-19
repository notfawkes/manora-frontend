import React from "react";

interface TrophyGoalProps {
  title: string;
}

export default function TrophyGoal({ title }: TrophyGoalProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-w-[130px] flex-1 max-w-[170px]">
      {/* Trophy Body with handles */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Handle */}
        <div className="absolute -left-1 top-2.5 h-16 w-5 rounded-l-full border-[7px] border-r-0 border-[#ECE4D8]" />

        {/* Cup */}
        <div className="z-10 flex min-h-[96px] w-[116px] flex-col items-center justify-center rounded-b-[40px] rounded-t-xl bg-[#ECE4D8] px-2.5 py-3 text-center shadow-md">
          <span className="text-xs sm:text-[13px] font-bold leading-tight text-[#1F1A17] select-none">
            {title}
          </span>
        </div>

        {/* Right Handle */}
        <div className="absolute -right-1 top-2.5 h-16 w-5 rounded-r-full border-[7px] border-l-0 border-[#ECE4D8]" />
      </div>

      {/* Stem */}
      <div className="h-4 w-3.5 bg-[#ECE4D8]" />

      {/* Pedestal Stand */}
      <div className="h-2.5 w-24 rounded-full bg-[#ECE4D8] shadow-sm" />
    </div>
  );
}
