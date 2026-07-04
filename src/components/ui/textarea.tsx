import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-36 w-full rounded-xl border border-navy-900/12 bg-white px-4 py-3 text-[15px] text-navy-900 placeholder:text-navy-900/40 transition-colors focus-visible:outline-none focus-visible:border-electric-400 focus-visible:ring-2 focus-visible:ring-electric-400/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
