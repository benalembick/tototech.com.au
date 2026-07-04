import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tagline?: boolean;
  light?: boolean;
}

export function Logo({ className, tagline = false, light = false }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col", className)}
      aria-label="TOTOTECH — home"
    >
      <Image
        src="/logos/logo_horiz_notag_trans-250w.png"
        alt="TOTOTECH"
        width={250}
        height={91}
        priority
        className={cn(
          "h-9 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105",
          light && "brightness-0 invert",
        )}
      />
      {tagline && (
        <span
          className={cn(
            "mt-1.5 text-[9px] font-medium uppercase tracking-[0.22em]",
            light ? "text-white/60" : "text-navy-900/50",
          )}
        >
          Strategy &middot; Architecture &middot; Transformation
        </span>
      )}
    </Link>
  );
}
