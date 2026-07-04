import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <Link href="/" className="group inline-flex items-center" aria-label="TOTOTECH — home">
      <Image
        src="/logos/logo_horiz_trans-350w.png"
        alt="TOTOTECH — Strategy, Architecture, Transformation"
        width={350}
        height={114}
        priority
        className={cn(
          "h-10 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105",
          light && "brightness-0 invert",
          className,
        )}
      />
    </Link>
  );
}
