"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import type { Stat } from "@/lib/types";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center sm:text-left"
        >
          <div className="font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            <Counter value={stat.value} suffix={stat.suffix} />
          </div>
          <p className="mt-2 text-[13.5px] font-medium text-navy-900/50">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
