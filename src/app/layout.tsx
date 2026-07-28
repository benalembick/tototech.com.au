import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VisualEditor } from "@/components/cms/visual-editor";
import { getNav, getSite } from "@/lib/content-data";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();

  return {
    metadataBase: new URL(site.domain),
    title: {
      default: `${site.name} — Technology Strategy & Enterprise Architecture Advisory`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [
      "technology strategy",
      "enterprise architecture",
      "digital transformation",
      "technology consulting Australia",
      "business analysis",
      "systems integration",
      "smart buildings",
      "higher education technology",
    ],
    authors: [{ name: site.legalName }],
    creator: site.legalName,
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: site.domain,
      siteName: site.name,
      title: `${site.name} — Technology Strategy & Enterprise Architecture Advisory`,
      description: site.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — Technology Strategy & Enterprise Architecture Advisory`,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/favicon_io/favicon.ico", sizes: "any" },
        { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon_io/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon_io/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/favicon_io/site.webmanifest",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [nav, site] = await Promise.all([getNav(), getSite()]);
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    alternateName: site.name,
    url: site.domain,
    logo: `${site.domain}/favicon_io/android-chrome-512x512.png`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: "AU",
    },
    sameAs: [site.linkedin],
    areaServed: "AU",
  };

  return (
    <html lang="en-AU" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-navy-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Navbar links={nav.primary} />
        <main className="flex-1">{children}</main>
        <Footer />
        <VisualEditor />
      </body>
    </html>
  );
}
