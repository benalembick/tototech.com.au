import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
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
      className={cn("group flex items-center gap-3", className)}
      aria-label="TOTOTECH — home"
    >
      <LogoMark className="h-9 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.35rem] font-bold tracking-tight",
            light ? "text-white" : "text-navy-900",
          )}
        >
          TOTO<span className="text-gradient-inline">TECH</span>
        </span>
        {tagline && (
          <span
            className={cn(
              "mt-1 text-[9px] font-medium uppercase tracking-[0.22em]",
              light ? "text-white/60" : "text-navy-900/50",
            )}
          >
            Strategy &middot; Architecture &middot; Transformation
          </span>
        )}
      </span>
    </Link>
  );
}
