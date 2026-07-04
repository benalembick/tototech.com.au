import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-400 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "text-white brand-gradient shadow-[0_8px_30px_-8px_rgba(37,99,235,0.55)] hover:shadow-[0_10px_36px_-6px_rgba(37,99,235,0.65)] hover:-translate-y-0.5",
        secondary:
          "bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5",
        outline:
          "border border-navy-900/15 text-navy-900 bg-white hover:border-electric-400/60 hover:-translate-y-0.5",
        ghost: "text-navy-900 hover:bg-navy-900/5",
        link: "text-electric-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-10 px-5 text-[13px]",
        lg: "h-14 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
