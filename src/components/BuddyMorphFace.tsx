"use client";

import React, { useEffect, useRef, useState } from "react";
import { BuddyExpression } from "@/types/interaction";

export type { BuddyExpression };

// Helper to approximate an ellipse as an 8-segment cubic bezier curve (50 numbers: M x0 y0 + 8 * (cp1x, cp1y, cp2x, cp2y, x, y))
function ellipseToBezierPoints(
  cx: number,
  cy: number,
  rx: number,
  ry: number
): number[] {
  const pts: number[] = [];
  const n = 8;
  const k = (4 / 3) * Math.tan(Math.PI / (2 * n));
  const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(
    (d) => (d * Math.PI) / 180
  );

  // M x y
  pts.push(cx + rx, cy);

  for (let i = 0; i < n; i++) {
    const a1 = angles[i];
    const a2 = i + 1 < n ? angles[i + 1] : 2 * Math.PI;

    const cp1x = cx + rx * Math.cos(a1) - k * rx * Math.sin(a1);
    const cp1y = cy + ry * Math.sin(a1) + k * ry * Math.cos(a1);

    const cp2x = cx + rx * Math.cos(a2) + k * rx * Math.sin(a2);
    const cp2y = cy + ry * Math.sin(a2) - k * ry * Math.cos(a2);

    const endX = cx + rx * Math.cos(a2);
    const endY = cy + ry * Math.sin(a2);

    pts.push(cp1x, cp1y, cp2x, cp2y, endX, endY);
  }
  return pts;
}

// 50 numbers for mouth path across all 7 SVG expressions
const EXPRESSION_MOUTH: Record<BuddyExpression, number[]> = {
  neutral: [
    100, 46,
    100.732, 46.8586, 101.425, 47.6596, 102.19, 48.4784,
    108.797, 55.568, 117.703, 62.2182, 129, 62.2617,
    140.292, 62.1786, 149.17, 55.5394, 155.802, 48.4711,
    156.569, 47.6545, 157.265, 46.8559, 158, 46,
    156.954, 46.4226, 155.971, 46.8036, 154.943, 47.217,
    145.848, 50.8048, 137.182, 54.3119, 128.988, 54.2617,
    120.796, 54.3395, 112.136, 50.8428, 103.052, 47.227,
    102.026, 46.8106, 101.045, 46.4265, 100, 46,
  ],
  happy: [
    100, 46,
    100.498, 47.1827, 100.975, 48.2963, 101.543, 49.417,
    106.293, 59.1118, 115.384, 68.1273, 129.009, 68.2617,
    142.625, 68.0787, 151.661, 59.0903, 156.446, 49.4116,
    157.018, 48.2927, 157.498, 47.1808, 158, 46,
    156.721, 46.0976, 155.523, 46.1654, 154.299, 46.2765,
    143.357, 47.2538, 134.849, 48.4119, 128.979, 48.2617,
    123.115, 48.4305, 114.639, 47.299, 103.699, 46.2884,
    102.477, 46.1739, 101.279, 46.1023, 100, 46,
  ],
  sad: [
    100, 58.2617,
    100.732, 57.4031, 101.425, 56.6021, 102.19, 55.7833,
    108.797, 48.6937, 117.703, 42.0435, 129, 42,
    140.292, 42.0831, 149.17, 48.7224, 155.802, 55.7906,
    156.569, 56.6072, 157.265, 57.4059, 158, 58.2617,
    156.954, 57.8391, 155.971, 57.4581, 154.943, 57.0447,
    145.848, 53.457, 137.182, 49.9498, 128.988, 50,
    120.796, 49.9222, 112.136, 53.4189, 103.052, 57.0348,
    102.026, 57.4511, 101.045, 57.8353, 100, 58.2617,
  ],
  concern: [
    100, 68.5,
    100.732, 69.3586, 101.425, 70.1596, 102.19, 70.9784,
    108.797, 78.068, 117.703, 84.7182, 129, 84.7617,
    140.292, 84.6786, 149.17, 78.0394, 155.802, 70.9711,
    156.569, 70.1545, 157.265, 69.3559, 158, 68.5,
    156.954, 68.9226, 155.971, 69.3036, 154.943, 69.717,
    145.848, 73.3048, 137.182, 76.8119, 128.988, 76.7617,
    120.796, 76.8395, 112.136, 73.3428, 103.052, 69.727,
    102.026, 69.3106, 101.045, 68.9265, 100, 68.5,
  ],
  frustation: [
    101.172, 63.0689,
    100.391, 69.6896, 99.6094, 76.3104, 98.8282, 82.9311,
    99.8689, 82.8862, 100.959, 82.8335, 101.982, 82.7631,
    111.3025, 82.05535, 120.623, 81.3476, 129.232, 79.5218,
    137.841, 77.696, 146.498, 75.69545, 155.155, 73.6949,
    156.095, 73.4679, 157.094, 73.2343, 158, 73,
    157.07, 72.9018, 156.051, 72.8027, 155.091, 72.6969,
    137.589, 70.7273, 119.899, 68.266, 103.78, 63.8483,
    102.915, 63.5989, 102.01, 63.3358, 101.172, 63.0689,
  ],
  energy: [
    100, 78,
    100.498, 79.1827, 100.975, 80.2963, 101.543, 81.417,
    106.293, 91.1118, 115.384, 100.127, 129.009, 100.262,
    142.625, 100.079, 151.661, 91.0903, 156.446, 81.4116,
    157.018, 80.2927, 157.498, 79.1808, 158, 78,
    156.721, 78.0976, 155.523, 78.1654, 154.299, 78.2765,
    143.357, 79.2538, 134.849, 80.4119, 128.979, 80.2617,
    123.115, 80.4305, 114.639, 79.299, 103.699, 78.2884,
    102.477, 78.1739, 101.279, 78.1023, 100, 78,
  ],
  warmth: [
    100, 45,
    100.732, 45.8586, 101.425, 46.6596, 102.19, 47.4784,
    108.797, 54.568, 117.703, 61.2182, 129, 61.2617,
    140.292, 61.1786, 149.17, 54.5394, 155.802, 47.4711,
    156.569, 46.6545, 157.265, 45.8559, 158, 45,
    156.954, 45.4226, 155.971, 45.8036, 154.943, 46.217,
    145.848, 49.8048, 137.182, 53.3119, 128.988, 53.2617,
    120.796, 53.3395, 112.136, 49.8428, 103.052, 46.227,
    102.026, 45.8106, 101.045, 45.4265, 100, 45,
  ],
};

// 50 numbers for LEFT EYE path
const EXPRESSION_LEFT_EYE: Record<BuddyExpression, number[]> = {
  neutral: ellipseToBezierPoints(66.5, 16.5, 12.5, 16.5),
  happy: ellipseToBezierPoints(66.5, 15.5, 12.5, 14.5),
  sad: ellipseToBezierPoints(66.5, 18.0, 12.5, 15.0),
  energy: ellipseToBezierPoints(66.5, 26.5, 12.5, 26.5),
  concern: [
    100.012, 0,
    100.102, 1.12492, 100.178, 2.18125, 100.216, 3.30095,
    100.557, 12.9861, 98.9623, 23.986, 91.0051, 32.0046,
    82.9616, 39.9306, 71.9891, 41.5138, 62.3014, 41.2055,
    61.1815, 41.1705, 60.125, 41.0976, 59, 41.0122,
    60.0385, 40.5713, 61.0027, 40.1459, 62.022, 39.7114,
    70.99, 35.8172, 79.5983, 32.1687, 85.3567, 26.3393,
    91.2044, 20.6017, 94.8555, 12.0055, 98.7214, 3.02603,
    99.1528, 2.00579, 99.575, 1.04032, 100.012, 0,
  ],
  frustation: [
    54.6704, 0,
    54.5811, 1.12492, 54.5046, 2.18125, 54.4663, 3.30095,
    54.1253, 12.9861, 55.7204, 23.986, 63.6775, 32.0046,
    71.721, 39.9306, 82.6935, 41.5138, 92.3813, 41.2055,
    93.5011, 41.1705, 94.5576, 41.0976, 95.6826, 41.0122,
    94.6441, 40.5713, 93.6799, 40.1459, 92.6607, 39.7114,
    83.6926, 35.8172, 75.0843, 32.1687, 69.3259, 26.3393,
    63.4782, 20.6017, 59.8271, 12.0055, 55.9613, 3.02603,
    55.5298, 2.00579, 55.1076, 1.04032, 54.6704, 0,
  ],
  warmth: [
    42, 16.2617,
    42.7323, 15.4031, 43.4252, 14.6021, 44.1898, 13.7833,
    50.7971, 6.69373, 59.7031, 0.0434856, 70.9996, 0,
    82.2918, 0.0830917, 91.17, 6.72235, 97.8023, 13.7906,
    98.5694, 14.6072, 99.2649, 15.4059, 100, 16.2617,
    98.9539, 15.8391, 97.9714, 15.4581, 96.9434, 15.0447,
    87.8484, 11.457, 79.1815, 7.94982, 70.9877, 7.99999,
    62.7956, 7.92219, 54.1355, 11.4189, 45.0525, 15.0348,
    44.026, 15.4511, 43.0448, 15.8353, 42, 16.2617,
  ],
};

// 50 numbers for RIGHT EYE path
const EXPRESSION_RIGHT_EYE: Record<BuddyExpression, number[]> = {
  neutral: ellipseToBezierPoints(189.5, 16.5, 12.5, 16.5),
  happy: ellipseToBezierPoints(189.5, 15.5, 12.5, 14.5),
  sad: ellipseToBezierPoints(189.5, 18.0, 12.5, 15.0),
  energy: ellipseToBezierPoints(189.5, 26.5, 12.5, 26.5),
  concern: [
    157.67, 0,
    157.581, 1.12492, 157.505, 2.18125, 157.466, 3.30095,
    157.125, 12.9861, 158.72, 23.986, 166.677, 32.0046,
    174.721, 39.9306, 185.694, 41.5138, 195.381, 41.2055,
    196.501, 41.1705, 197.558, 41.0976, 198.683, 41.0122,
    197.644, 40.5713, 196.68, 40.1459, 195.661, 39.7114,
    186.693, 35.8172, 178.084, 32.1687, 172.326, 26.3393,
    166.478, 20.6017, 162.827, 12.0055, 158.961, 3.02603,
    158.53, 2.00579, 158.108, 1.04032, 157.67, 0,
  ],
  frustation: [
    206.012, 0,
    206.102, 1.12492, 206.178, 2.18125, 206.216, 3.30095,
    206.557, 12.9861, 204.962, 23.986, 197.005, 32.0046,
    188.962, 39.9306, 177.989, 41.5138, 168.301, 41.2055,
    167.182, 41.1705, 166.125, 41.0976, 165, 41.0122,
    166.039, 40.5713, 167.003, 40.1459, 168.022, 39.7114,
    176.99, 35.8172, 185.598, 32.1687, 191.357, 26.3393,
    197.204, 20.6017, 200.856, 12.0055, 204.721, 3.02603,
    205.153, 2.00579, 205.575, 1.04032, 206.012, 0,
  ],
  warmth: [
    156, 16.2617,
    156.732, 15.4031, 157.425, 14.6021, 158.19, 13.7833,
    164.797, 6.69373, 173.703, 0.0434856, 185, 0,
    196.292, 0.0830917, 205.17, 6.72235, 211.802, 13.7906,
    212.569, 14.6072, 213.265, 15.4059, 214, 16.2617,
    212.954, 15.8391, 211.971, 15.4581, 210.943, 15.0447,
    201.848, 11.457, 193.182, 7.94982, 184.988, 7.99999,
    176.796, 7.92219, 168.136, 11.4189, 159.052, 15.0348,
    158.026, 15.4511, 157.045, 15.8353, 156, 16.2617,
  ],
};

// Cheek coordinates and styling
const CHEEK_CONFIG: Record<
  BuddyExpression,
  { cy: number; scale: number; opacity: number }
> = {
  neutral: { cy: 57, scale: 1.0, opacity: 0.85 },
  happy: { cy: 57, scale: 1.35, opacity: 1.0 },
  sad: { cy: 57, scale: 0.85, opacity: 0.6 },
  concern: { cy: 84, scale: 1.0, opacity: 0.85 },
  frustation: { cy: 84, scale: 1.1, opacity: 0.9 },
  energy: { cy: 89, scale: 1.3, opacity: 1.0 },
  warmth: { cy: 56, scale: 1.3, opacity: 1.0 },
};

function pointsToPathString(pts: number[]): string {
  if (pts.length < 50) return "";
  return `M${pts[0]} ${pts[1]} C${pts[2]} ${pts[3]} ${pts[4]} ${pts[5]} ${pts[6]} ${pts[7]} C${pts[8]} ${pts[9]} ${pts[10]} ${pts[11]} ${pts[12]} ${pts[13]} C${pts[14]} ${pts[15]} ${pts[16]} ${pts[17]} ${pts[18]} ${pts[19]} C${pts[20]} ${pts[21]} ${pts[22]} ${pts[23]} ${pts[24]} ${pts[25]} C${pts[26]} ${pts[27]} ${pts[28]} ${pts[29]} ${pts[30]} ${pts[31]} C${pts[32]} ${pts[33]} ${pts[34]} ${pts[35]} ${pts[36]} ${pts[37]} C${pts[38]} ${pts[39]} ${pts[40]} ${pts[41]} ${pts[42]} ${pts[43]} C${pts[44]} ${pts[45]} ${pts[46]} ${pts[47]} ${pts[48]} ${pts[49]} Z`;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface BuddyMorphFaceProps {
  expression?: BuddyExpression;
  intensity?: number;
  className?: string;
}

export default function BuddyMorphFace({
  expression = "neutral",
  intensity = 0.65,
  className = "",
}: BuddyMorphFaceProps) {
  // Current animated points for Mouth, Left Eye, and Right Eye
  const mouthPointsRef = useRef<number[]>([...EXPRESSION_MOUTH.neutral]);
  const leftEyePointsRef = useRef<number[]>([...EXPRESSION_LEFT_EYE.neutral]);
  const rightEyePointsRef = useRef<number[]>([...EXPRESSION_RIGHT_EYE.neutral]);

  const [mouthPath, setMouthPath] = useState<string>(() =>
    pointsToPathString(EXPRESSION_MOUTH[expression] || EXPRESSION_MOUTH.neutral)
  );
  const [leftEyePath, setLeftEyePath] = useState<string>(() =>
    pointsToPathString(EXPRESSION_LEFT_EYE[expression] || EXPRESSION_LEFT_EYE.neutral)
  );
  const [rightEyePath, setRightEyePath] = useState<string>(() =>
    pointsToPathString(EXPRESSION_RIGHT_EYE[expression] || EXPRESSION_RIGHT_EYE.neutral)
  );

  // Blush parameters
  const [blushProps, setBlushProps] = useState(() => CHEEK_CONFIG[expression] || CHEEK_CONFIG.neutral);

  const [isBlinking, setIsBlinking] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const currentExprRef = useRef<BuddyExpression>(expression);

  // Periodic gentle natural blink for character vitality
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 150);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // REAL SVG geometry deformation when expression changes
  useEffect(() => {
    // Prevent redundant morphing if already in the target expression
    if (currentExprRef.current === expression && animFrameRef.current === null) {
      return;
    }

    const targetMouth = EXPRESSION_MOUTH[expression] || EXPRESSION_MOUTH.neutral;
    const targetLeftEye = EXPRESSION_LEFT_EYE[expression] || EXPRESSION_LEFT_EYE.neutral;
    const targetRightEye = EXPRESSION_RIGHT_EYE[expression] || EXPRESSION_RIGHT_EYE.neutral;
    const targetCheek = CHEEK_CONFIG[expression] || CHEEK_CONFIG.neutral;

    const startMouth = [...mouthPointsRef.current];
    const startLeftEye = [...leftEyePointsRef.current];
    const startRightEye = [...rightEyePointsRef.current];
    const startCheek = { ...blushProps };

    const duration = 650; // ms for smooth organic shape deformation
    const startTime = performance.now();

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = easeInOutCubic(progress);

      // Deform mouth path
      const nextMouth = startMouth.map(
        (startVal, i) => startVal + (targetMouth[i] - startVal) * ease
      );
      mouthPointsRef.current = nextMouth;
      setMouthPath(pointsToPathString(nextMouth));

      // Deform left eye path
      const nextLeftEye = startLeftEye.map(
        (startVal, i) => startVal + (targetLeftEye[i] - startVal) * ease
      );
      leftEyePointsRef.current = nextLeftEye;
      setLeftEyePath(pointsToPathString(nextLeftEye));

      // Deform right eye path
      const nextRightEye = startRightEye.map(
        (startVal, i) => startVal + (targetRightEye[i] - startVal) * ease
      );
      rightEyePointsRef.current = nextRightEye;
      setRightEyePath(pointsToPathString(nextRightEye));

      // Morph cheek positions & opacity
      setBlushProps({
        cy: startCheek.cy + (targetCheek.cy - startCheek.cy) * ease,
        scale: startCheek.scale + (targetCheek.scale - startCheek.scale) * ease,
        opacity: startCheek.opacity + (targetCheek.opacity - startCheek.opacity) * ease,
      });

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        animFrameRef.current = null;
        currentExprRef.current = expression;
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [expression]);

  return (
    <svg
      viewBox="0 0 258 124"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto select-none pointer-events-none ${className}`}
    >
      <defs>
        <filter
          id="buddy_blush_left"
          x="0"
          y="20"
          width="70"
          height="90"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="15" result="effect_blur_l" />
        </filter>
        <filter
          id="buddy_blush_right"
          x="188"
          y="20"
          width="70"
          height="90"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="15" result="effect_blur_r" />
        </filter>
      </defs>

      {/* Left Eye - Morphs continuously between geometric shapes */}
      <g
        style={{
          transformOrigin: "66.5px 20px",
          transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
          transition: isBlinking ? "transform 0.08s ease" : "none",
        }}
      >
        <path d={leftEyePath} fill="black" />
      </g>

      {/* Right Eye - Morphs continuously between geometric shapes */}
      <g
        style={{
          transformOrigin: "189.5px 20px",
          transform: isBlinking ? "scaleY(0.1)" : "scaleY(1)",
          transition: isBlinking ? "transform 0.08s ease" : "none",
        }}
      >
        <path d={rightEyePath} fill="black" />
      </g>

      {/* Left Blush with Filtered Blur */}
      <g filter="url(#buddy_blush_left)" opacity={blushProps.opacity}>
        <circle cx="35" cy={blushProps.cy} r={5 * blushProps.scale} fill="#FF0000" />
      </g>

      {/* Right Blush with Filtered Blur */}
      <g filter="url(#buddy_blush_right)" opacity={blushProps.opacity}>
        <circle cx="223" cy={blushProps.cy} r={5 * blushProps.scale} fill="#FF0000" />
      </g>

      {/* Morphed Mouth Path - Deforms mathematically across all 7 expressions */}
      <path d={mouthPath} fill="black" />
    </svg>
  );
}
