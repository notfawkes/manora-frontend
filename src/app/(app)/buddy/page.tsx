"use client";

import Image from "next/image";

export default function Buddy() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F2EFE7]">
      {/* Background */}
      <Image
        src="/images/background.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[rgba(21,0,0,0.5)]" />

      {/* Content area - excludes sidebar */}
      <div className="absolute inset-y-0 left-62 right-0 overflow-hidden">
        {/* Buddy glow */}
        <div
          className="
            absolute
            left-1/2
            top-[15%]
            h-80
            w-80
            -translate-x-1/2
            rounded-full
            bg-[#D9D9D9]
            blur-[100px]
          "
        />

        {/* Buddy */}
        <div
          className="
            absolute
            left-1/2
            top-[5%]
            h-130
            w-130
            -translate-x-1/2
          "
        >
          <Image
            src="/images/cloud_buddy.png"
            alt="Buddy"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Bottom vignette */}
        <div
          className="
            absolute
            bottom-0
            left-0
            h-50
            w-full
            opacity-50
            bg-[#1F0B00]
          "
        />

        {/* Greeting */}
        <div
          className="
            absolute
            bottom-11.25
            left-1/2
            w-178.5
            -translate-x-1/2
            text-center
            text-[40px]
            font-bold
            leading-[1.2]
            tracking-[-0.03em]
            text-white
          "
        >
          Hello Bala, How was your day?
        </div>
      </div>
    </main>
  );
}