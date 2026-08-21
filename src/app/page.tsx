'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImagewithFallback";
const imgBackground = "/images/background-home.png";
const imgBuddy = "/images/cloud_buddy-home.png";
const imgCloudChar = "/images/cloud_buddy.png";
const imgTree = "/images/tree.png";
const alternatetimeline = "/images/alternate-timeline.png"
const imgQuiz = "/images/question.png";
import svgPaths from "@/components/svg-path";

const BROWN = "#7c5500";
const FONT = "'Plus Jakarta Sans', sans-serif";

function CloudButtonIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 82 82"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d={svgPaths.p3cdc0a00} fill="#EFE4DA" />
      <path d={svgPaths.pd7ece40} fill="black" />
      <path d={svgPaths.p1bd3fd80} fill="black" />
      <path d={svgPaths.p22a39180} fill="black" />
    </svg>
  );
}

type Mood = "calm" | "happy" | "anxious" | "frustrated" | "low";

function MoodFaceOverlay({ mood }: { mood: Mood }) {
  const hasBlush = mood !== "happy";
  const p = `mf-${mood}`;

  return (
    <svg
      viewBox="0 0 188 188"
      className="absolute inset-0 w-full h-full"
      fill="none"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        {hasBlush && (
          <>
            <filter
              id={`${p}-l`}
              x="0"
              y="46"
              width="140"
              height="120"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="18" />
            </filter>
            <filter
              id={`${p}-r`}
              x="72"
              y="46"
              width="140"
              height="120"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </>
        )}
      </defs>

      {/* Round eyes (calm, happy, anxious, low) */}
      {mood !== "frustrated" && (
        <>
          <ellipse cx="75" cy="83" rx="3.80259" ry="5.01942" fill="black" />
          <ellipse cx="112" cy="83" rx="3.80259" ry="5.01942" fill="black" />
        </>
      )}

      {/* Squinting eyes (frustrated) — p16203e00 + pd25d0f0 */}
      {mood === "frustrated" && (
        <>
          <g transform="translate(71.11, 77.15)">
            <path d={svgPaths.p16203e00} fill="black" />
          </g>
          <g transform="translate(108.13, 77.08)">
            <path d={svgPaths.pd25d0f0} fill="black" />
          </g>
        </>
      )}

      {/* Blush cheeks */}
      {hasBlush && (
        <>
          <g filter={`url(#${p}-l)`}>
            <circle cx="65" cy="96" r="5" fill="#FF0000" />
          </g>
          <g filter={`url(#${p}-r)`}>
            <circle cx="122" cy="96" r="5" fill="#FF0000" />
          </g>
        </>
      )}

      {/* Calm: subtle smile — p3aa8a100 in its native SVG coords, offset to character space */}
      {mood === "calm" && (
        <g transform="translate(33.89, 64)">
          <path d={svgPaths.p3aa8a100} fill="black" />
        </g>
      )}

      {/* Happy: wide smile — p57bb200 */}
      {mood === "happy" && (
        <g transform="translate(81.83, 94)">
          <path d={svgPaths.p57bb200} fill="black" />
        </g>
      )}

      {/* Anxious / Low: frown — p1076f200 flipped vertically */}
      {(mood === "anxious" || mood === "low") && (
        <g transform="translate(85.48, 102) scale(1, -1)">
          <path d={svgPaths.p1076f200} fill="black" />
        </g>
      )}

      {/* Frustrated: straight grimace — p28eafbc0 */}
      {mood === "frustrated" && (
        <g transform="translate(81.57, 90.01)">
          <path d={svgPaths.p28eafbc0} fill="black" />
        </g>
      )}
    </svg>
  );
}

const MOODS: { id: Mood; label: string }[] = [
  { id: "calm", label: "Calm" },
  { id: "happy", label: "Happy" },
  { id: "anxious", label: "Anxious" },
  { id: "frustrated", label: "Frustrated" },
  { id: "low", label: "Low" },
];

function MoodOption({
  mood,
  label,
  selected,
  onClick,
}: {
  mood: Mood;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Select mood: ${label}`}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1.5 transition-transform duration-200 focus:outline-none ${
        selected ? "scale-110" : "hover:scale-105 active:scale-95"
      }`}
    >
      <div className="relative w-18 h-18 sm:w-30 sm:h-30">
        <ImageWithFallback
          src={imgCloudChar}
          alt={`${label} cloud`}
          className="absolute inset-0 w-full h-full object-contain"
        />
        <MoodFaceOverlay mood={mood} />
      </div>
      <span
        className="text-[10px] sm:text-xs font-semibold leading-none"
        style={{ color: selected ? BROWN : `${BROWN}cc`, fontFamily: FONT }}
      >
        {label}
      </span>
    </button>
  );
}


function FeatureCard({
  title,
  subtitle,
  image,
  imageGlow,
  href,
  variant = "default",
}: {
  title: string;
  subtitle: string;
  image?: string;
  imageGlow?: boolean;
  href: string;
  variant?: "default" | "questionnaire" | "timeline";
}) {
  const router = useRouter();

  // Alternate Timeline
  if (variant === "timeline") {
    return (
      <div className="relative flex-1 min-w-0 min-h-[620px] rounded-[22px] overflow-hidden shadow-[0px_4px_20px_0px_#9f9999]">
        {/* Full-card image */}
        {image && (
          <ImageWithFallback
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Bottom transparent rectangle */}
        <div className="absolute left-0 right-0 bottom-0 bg-white/50 backdrop-blur-[2px] p-6">
          <h3
            className="font-bold text-[30px] text-black leading-tight"
            style={{ fontFamily: FONT }}
          >
            {title}
          </h3>

          <p
            className="text-[20px] text-black leading-snug mt-3"
            style={{ fontFamily: FONT }}
          >
            {subtitle}
          </p>

          <button
            type="button"
            className="mt-6 bg-[#f7f3ea] rounded-[22px] shadow-[0px_4px_20px_0px_#9f9999] px-5 py-5 flex items-center justify-between w-full hover:brightness-95 active:scale-95 transition-all duration-150"
            style={{ fontFamily: FONT }}
            onClick={() => router.push(href)}
          >
            <span className="font-semibold text-[20px] text-black">
              Explore
            </span>

            <span className="font-semibold text-[20px] text-black leading-none">
              {">"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Memory Tree + Questionnaire
  return (
    <div
      className={`flex-1 min-w-0 min-h-[620px] rounded-[22px] overflow-hidden flex flex-col shadow-[0px_4px_20px_0px_#9f9999] ${
        variant === "questionnaire"
          ? "bg-gradient-to-br from-[#dcefff] via-[#d4eaff] to-[#c5e1f7]"
          : "bg-[#ebead8]"
      }`}
    >
      {/* TOP IMAGE */}
      <div
        className={`relative h-[48%] flex-shrink-0 mb-18 flex items-center justify-center p-2 ${
          imageGlow
            ? "shadow-[0px_4px_42.4px_0px_#8aab70]"
            : ""
        }`}
      >
        {image && (
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* BOTTOM CONTENT RECTANGLE */}
      <div className="flex flex-col flex-1 bg-white/50 backdrop-blur-[2px] p-6">
        <h3
          className="font-bold text-[30px] text-black leading-tight"
          style={{ fontFamily: FONT }}
        >
          {title}
        </h3>

        <p
          className="text-[20px] text-black leading-snug mt-3"
          style={{ fontFamily: FONT }}
        >
          {subtitle}
        </p>

        <button
          type="button"
          className="mt-auto bg-[#f7f3ea] rounded-[22px] shadow-[0px_4px_20px_0px_#9f9999] px-5 py-5 flex items-center justify-between w-full hover:brightness-95 active:scale-95 transition-all duration-150"
          style={{ fontFamily: FONT }}
          onClick={() => router.push(href)}
        >
          <span className="font-semibold text-[20px] text-black">
            {variant === "questionnaire" ? "Start" : "Explore"}
          </span>

          <span className="font-semibold text-[20px] text-black leading-none">
            {">"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f3ea]">
        <p className="text-xl font-semibold" style={{ color: BROWN }}>Loading...</p>
      </div>
    );
  }

  const userName = session?.user?.name || "Friend";

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden md:pl-64"
      style={{ fontFamily: FONT }}
    >
      {/* Full-page background image */}
      <div className="absolute top-0 left-0 w-full pointer-events-none -z-10">
        <ImageWithFallback
          src={imgBackground}
          alt=""
          className="block w-full h-auto"
        />
      </div>

      {/* Centred content column */}
      <div className="max-w-280 mx-auto px-4 pb-10">
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex flex-col justify-center py-10">
          {/* Buddy mascot — right half */}
          <div className="absolute right-0 top-0 w-[65%] h-full pointer-events-none select-none">
            <div className="buddy-levitate w-full h-full">
            <ImageWithFallback
              src={imgBuddy}
              alt="Buddy the cloud companion"
              className="w-full h-full object-contain object-bottom-right"
            />
            </div>
          </div>

          {/* Text block — left half */}
          <div className="relative z-10 max-w-[43%]">
            <p
              className="font-bold text-[22px] sm:text-[42px] leading-tight tracking-tighter mb-3"
              style={{ color: BROWN }}
            >
              Good Afternoon,
            </p>
            <h1
              className="font-bold text-[58px] sm:text-[84px] leading-none tracking-tighter -mt-1"
              style={{ color: BROWN }}
            >
              {userName}
            </h1>
            <p
              className="font-bold text-[13px] sm:text-[35px] tracking-tighter leading-snug mt-3"
              style={{ color: BROWN }}
            >
              {"I'm here to understand you, reflect with you, and help you make better choices"}
            </p>

            {/* CTA button */}
            <button
              className="mt-5 w-100 bg-[#7c5500] rounded-[28px] shadow-[0px_4px_20px_0px_#9f9999] flex items-center gap-2.5 px-6 py-6 hover:brightness-110 active:scale-95 transition-all duration-150"
            >
              <CloudButtonIcon />
              <span
                className="font-semibold text-[35px] sm:text-[35px] tracking-tight"
                style={{ color: "#f1e7de" }}
              >
                Talk to Buddy
              </span>
            </button>
          </div>
        </section>

        {/* ── Mood selector ── */}
        <section className="bg-[rgba(236,225,214,0.79)] rounded-[28px] shadow-[0px_4px_20px_0px_#9f9999] p-4 sm:p-5 mb-16 h-60">
          <h2
            className="font-semibold text-[19px] sm:text-2xl tracking-tight mb-4"
            style={{ color: BROWN }}
          >
            How are you feeling today?
          </h2>
          <div className="flex justify-between items-end gap-1">
            {MOODS.map(({ id, label }) => (
              <MoodOption
                key={id}
                mood={id}
                label={label}
                selected={selectedMood === id}
                onClick={() =>
                  setSelectedMood(selectedMood === id ? null : id)
                }
              />
            ))}
          </div>
        </section>

        {/* ── Feature cards ── */}
      <section className="flex gap-3">
        <FeatureCard
          title="Memory Tree"
          subtitle="Explore what memory and emotion matters most to you"
          image={imgTree}
          href="/memory-tree"
        />

        <FeatureCard
          title="Questionnaire"
          subtitle="Get a health score by answering this"
          image={imgQuiz}
          href="/"
          variant="questionnaire"
        />

        <FeatureCard
          title="Alternate Timeline"
          subtitle="See how different choices shape your tomorrow"
          image={alternatetimeline}
          href="/timeline"
          variant="timeline"
        />
      </section>
      </div>
    </div>
  );
}
