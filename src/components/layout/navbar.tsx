"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import navData from "@/content/nav.json";
import type { NavLink } from "@/lib/types";

const links = navData.primary as NavLink[];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Every inner page opens on a dark PageHero; only the homepage hero is light.
  const onDark = !scrolled && !open && pathname !== "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(11,24,54,0.06)]"
          : "bg-transparent",
      )}
    >
      <Container>
        <nav className="flex h-20 items-center justify-between">
          <Logo light={onDark} />

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-[14.5px] font-medium transition-colors",
                    onDark
                      ? "text-white/70 hover:text-white"
                      : "text-navy-900/70 hover:text-navy-900",
                    pathname === link.href && (onDark ? "text-white" : "text-navy-900"),
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button asChild size="sm">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </div>

          <button
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
              onDark ? "text-white" : "text-navy-900",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-navy-900/8 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium text-navy-900/80 hover:bg-navy-900/5 hover:text-navy-900"
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-3 w-full">
                <Link href="/contact">Book a Consultation</Link>
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
