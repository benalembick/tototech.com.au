"use client";

import { motion } from "framer-motion";

type ShapeType = "rect" | "hex" | "ring";

interface Variant {
  paths: string[];
  nodes: [number, number][];
  shape: { type: ShapeType; cx: number; cy: number; size: number };
  blobs: { className: string; animate: { x: number[]; y: number[] }; duration: number }[];
}

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
}

const variants: Variant[] = [
  {
    paths: [
      "M60,360 L260,260 L440,320 L640,180 L880,240",
      "M20,120 L220,180 L400,80 L600,140 L920,60",
    ],
    nodes: [
      [260, 260],
      [440, 320],
      [640, 180],
      [220, 180],
      [400, 80],
      [600, 140],
    ],
    shape: { type: "rect", cx: 830, cy: 170, size: 220 },
    blobs: [
      { className: "-left-16 top-0 h-80 w-80 bg-electric-500/25", animate: { y: [0, 22, 0], x: [0, 14, 0] }, duration: 10 },
      { className: "right-0 top-1/4 h-96 w-96 bg-electric-300/15", animate: { y: [0, -18, 0], x: [0, -16, 0] }, duration: 12 },
    ],
  },
  {
    paths: [
      "M40,420 L300,340 L520,400 L760,260 L1000,320",
      "M100,80 L340,140 L560,60 L800,120 L1080,40",
    ],
    nodes: [
      [300, 340],
      [520, 400],
      [760, 260],
      [340, 140],
      [560, 60],
      [800, 120],
    ],
    shape: { type: "ring", cx: 260, cy: 130, size: 100 },
    blobs: [
      { className: "right-0 top-0 h-80 w-80 bg-electric-500/20", animate: { y: [0, 20, 0], x: [0, -14, 0] }, duration: 11 },
      { className: "-left-10 bottom-0 h-96 w-96 bg-electric-300/15", animate: { y: [0, -20, 0], x: [0, 12, 0] }, duration: 13 },
    ],
  },
  {
    paths: [
      "M0,200 L200,140 L420,220 L680,100 L960,180",
      "M60,440 L280,380 L480,440 L740,320 L1020,380",
    ],
    nodes: [
      [200, 140],
      [420, 220],
      [680, 100],
      [280, 380],
      [480, 440],
      [740, 320],
    ],
    shape: { type: "hex", cx: 970, cy: 320, size: 90 },
    blobs: [
      { className: "-left-20 top-1/3 h-80 w-80 bg-electric-300/20", animate: { y: [0, -16, 0], x: [0, 18, 0] }, duration: 9 },
      { className: "right-0 bottom-0 h-96 w-96 bg-electric-500/15", animate: { y: [0, 18, 0], x: [0, -12, 0] }, duration: 14 },
    ],
  },
  {
    paths: [
      "M40,100 L260,180 L480,120 L700,220 L940,140",
      "M20,380 L240,320 L460,380 L680,300 L900,360",
    ],
    nodes: [
      [260, 180],
      [480, 120],
      [700, 220],
      [240, 320],
      [460, 380],
      [680, 300],
    ],
    shape: { type: "rect", cx: 150, cy: 380, size: 150 },
    blobs: [
      { className: "right-0 top-1/2 h-96 w-96 bg-electric-500/20", animate: { y: [0, -22, 0], x: [0, -10, 0] }, duration: 12 },
      { className: "-left-16 top-0 h-72 w-72 bg-electric-300/20", animate: { y: [0, 16, 0], x: [0, 14, 0] }, duration: 10 },
    ],
  },
  {
    paths: [
      "M80,300 L320,220 L540,300 L780,180 L1040,260",
      "M0,60 L220,120 L440,40 L680,100 L960,20",
    ],
    nodes: [
      [320, 220],
      [540, 300],
      [780, 180],
      [220, 120],
      [440, 40],
      [680, 100],
    ],
    shape: { type: "ring", cx: 1060, cy: 260, size: 120 },
    blobs: [
      { className: "-left-10 top-0 h-80 w-80 bg-electric-300/20", animate: { y: [0, 20, 0], x: [0, 16, 0] }, duration: 11 },
      { className: "right-0 bottom-10 h-96 w-96 bg-electric-500/15", animate: { y: [0, -20, 0], x: [0, -14, 0] }, duration: 13 },
    ],
  },
  {
    paths: [
      "M20,440 L240,360 L440,420 L680,300 L980,360",
      "M60,60 L280,140 L500,80 L740,160 L1000,100",
    ],
    nodes: [
      [240, 360],
      [440, 420],
      [680, 300],
      [280, 140],
      [500, 80],
      [740, 160],
    ],
    shape: { type: "hex", cx: 200, cy: 130, size: 100 },
    blobs: [
      { className: "right-0 top-0 h-72 w-72 bg-electric-500/25", animate: { y: [0, 18, 0], x: [0, -16, 0] }, duration: 9 },
      { className: "-left-16 bottom-0 h-96 w-96 bg-electric-300/15", animate: { y: [0, -16, 0], x: [0, 12, 0] }, duration: 14 },
    ],
  },
  {
    paths: [
      "M40,160 L260,240 L480,160 L720,260 L980,180",
      "M0,420 L220,340 L460,400 L700,320 L1040,380",
    ],
    nodes: [
      [260, 240],
      [480, 160],
      [720, 260],
      [220, 340],
      [460, 400],
      [700, 320],
    ],
    shape: { type: "rect", cx: 1000, cy: 400, size: 170 },
    blobs: [
      { className: "-left-16 top-1/4 h-96 w-96 bg-electric-500/20", animate: { y: [0, 22, 0], x: [0, 14, 0] }, duration: 10 },
      { className: "right-0 top-0 h-72 w-72 bg-electric-300/20", animate: { y: [0, -18, 0], x: [0, -14, 0] }, duration: 12 },
    ],
  },
];

function pickVariant(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return variants[hash % variants.length];
}

export function DarkHeroBackground({ seed = "default" }: { seed?: string }) {
  const variant = pickVariant(seed);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-fade-dark" />

      {variant.blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[110px] ${blob.className}`}
          animate={{ y: blob.animate.y, x: blob.animate.x }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        viewBox="0 0 1200 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="pageHeroLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--electric-300)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--electric-300)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--electric-300)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {variant.shape.type === "rect" && (
          <motion.rect
            x={variant.shape.cx - variant.shape.size / 2}
            y={variant.shape.cy - variant.shape.size / 2}
            width={variant.shape.size}
            height={variant.shape.size}
            stroke="var(--electric-500)"
            strokeOpacity="0.35"
            strokeWidth="1"
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 1 }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1.2 },
            }}
            style={{ transformOrigin: `${variant.shape.cx}px ${variant.shape.cy}px` }}
          />
        )}

        {variant.shape.type === "hex" && (
          <motion.polygon
            points={hexPoints(variant.shape.cx, variant.shape.cy, variant.shape.size / 2)}
            stroke="var(--electric-500)"
            strokeOpacity="0.35"
            strokeWidth="1"
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: -360, opacity: 1 }}
            transition={{
              rotate: { duration: 70, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1.2 },
            }}
            style={{ transformOrigin: `${variant.shape.cx}px ${variant.shape.cy}px` }}
          />
        )}

        {variant.shape.type === "ring" && (
          <>
            <circle
              cx={variant.shape.cx}
              cy={variant.shape.cy}
              r={variant.shape.size / 2}
              stroke="var(--electric-500)"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
            <motion.circle
              cx={variant.shape.cx}
              cy={variant.shape.cy}
              r={variant.shape.size / 2 - 18}
              stroke="var(--electric-300)"
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="4 10"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${variant.shape.cx}px ${variant.shape.cy}px` }}
            />
          </>
        )}
        <circle cx={variant.shape.cx} cy={variant.shape.cy} r="3" fill="var(--electric-300)" />

        {variant.paths.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="url(#pageHeroLine)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.3 + i * 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}

        {variant.nodes.map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={3.5}
            fill="var(--electric-300)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1 + i * 0.12 }}
          />
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-950 to-transparent" />
    </div>
  );
}
