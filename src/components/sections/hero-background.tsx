"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-fade" />

      <motion.div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-electric-400/20 blur-[100px]"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-electric-500/15 blur-[120px]"
        animate={{ y: [0, 24, 0], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 1200 800"
        fill="none"
      >
        <defs>
          <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--electric-500)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--electric-500)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--electric-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          "M80,620 L320,480 L520,560 L760,360 L1000,420",
          "M40,240 L280,320 L500,180 L740,260 L1120,140",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            stroke="url(#heroLine)"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.4 + i * 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        {[
          [320, 480],
          [520, 560],
          [760, 360],
          [280, 320],
          [500, 180],
          [740, 260],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={4}
            fill="var(--electric-500)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 + i * 0.12 }}
          />
        ))}
      </svg>
    </div>
  );
}
