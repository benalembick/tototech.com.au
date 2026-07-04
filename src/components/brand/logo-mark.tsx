import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 110"
      className={cn("h-9 w-auto", className)}
      role="img"
      aria-label="TOTOTECH icon mark"
    >
      <defs>
        <linearGradient id="totoElectric" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--electric-300)" />
          <stop offset="55%" stopColor="var(--electric-500)" />
          <stop offset="100%" stopColor="var(--electric-600)" />
        </linearGradient>
      </defs>
      {/* left navy blade of the T */}
      <path
        d="M6 4 H60 L48 24 H36 V78 L18 92 V24 H6 Z"
        fill="var(--navy-900)"
      />
      {/* right electric blade of the T */}
      <path
        d="M42 4 H94 L82 24 H64 V78 L58 82 V24 H50 Z"
        fill="url(#totoElectric)"
      />
      {/* pen nib stem */}
      <rect x="49" y="24" width="4" height="70" fill="white" />
      <circle cx="51" cy="52" r="4.5" fill="white" />
      <circle cx="51" cy="52" r="1.8" fill="var(--navy-900)" />
    </svg>
  );
}
