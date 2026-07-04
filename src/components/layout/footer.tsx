import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { LinkedInIcon } from "@/components/icons/linkedin-icon";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import navData from "@/content/nav.json";
import siteData from "@/content/site.json";
import type { FooterColumn, NavLink } from "@/lib/types";
import type { SiteConfig } from "@/lib/types";

const columns = navData.footerColumns as FooterColumn[];
const legal = navData.legal as NavLink[];
const site = siteData as SiteConfig;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-900/8 bg-navy-950 text-white/70">
      <Container className="py-16">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo light className="h-12" />
            <p className="mt-5 text-[14.5px] leading-relaxed text-white/50">
              {site.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="TOTOTECH on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-electric-400/50 hover:text-white"
              >
                <LinkedInIcon className="h-[17px] w-[17px]" />
              </a>
              <a
                href={`mailto:${site.email}`}
                aria-label="Email TOTOTECH"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-electric-400/50 hover:text-white"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-white/40">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 text-[14px] text-white/40 lg:hidden">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span>
            {site.address.line1}, {site.address.line2}, {site.address.suburb}{" "}
            {site.address.state} {site.address.postcode}
          </span>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-[13.5px] text-white/40 sm:flex-row sm:items-center">
          <p>
            &copy; {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white/70">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
