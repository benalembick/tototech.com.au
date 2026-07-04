"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li";
}

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function FadeIn({
  children,
  className,
  delay = 0,
  as = "div",
}: AnimationWrapperProps) {
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}
