"use client";

import { motion } from "framer-motion";

export function DarkHeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-fade-dark" />

      <motion.div
        className="absolute -left-16 top-0 h-80 w-80 rounded-full bg-electric-500/25 blur-[110px]"
        animate={{ y: [0, 22, 0], x: [0, 14, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-electric-300/15 blur-[130px]"
        animate={{ y: [0, -18, 0], x: [0, -16, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

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

        <motion.rect
          x="720"
          y="60"
          width="220"
          height="220"
          stroke="var(--electric-500)"
          strokeOpacity="0.35"
          strokeWidth="1"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 1 }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            opacity: { duration: 1.2 },
          }}
          style={{ transformOrigin: "830px 170px" }}
        />
        <circle cx="830" cy="170" r="3" fill="var(--electric-300)" />

        {[
          "M60,360 L260,260 L440,320 L640,180 L880,240",
          "M20,120 L220,180 L400,80 L600,140 L920,60",
        ].map((d, i) => (
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

        {[
          [260, 260],
          [440, 320],
          [640, 180],
          [220, 180],
          [400, 80],
          [600, 140],
        ].map(([cx, cy], i) => (
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
