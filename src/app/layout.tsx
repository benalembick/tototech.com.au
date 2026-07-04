import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import siteData from "@/content/site.json";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteData.domain),
  title: {
    default: `${siteData.name} — Technology Strategy & Enterprise Architecture Advisory`,
    template: `%s | ${siteData.name}`,
  },
  description: siteData.description,
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
  authors: [{ name: siteData.legalName }],
  creator: siteData.legalName,
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteData.domain,
    siteName: siteData.name,
    title: `${siteData.name} — Technology Strategy & Enterprise Architecture Advisory`,
    description: siteData.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteData.name} — Technology Strategy & Enterprise Architecture Advisory`,
    description: siteData.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteData.legalName,
  alternateName: siteData.name,
  url: siteData.domain,
  logo: `${siteData.domain}/icon`,
  description: siteData.description,
  email: siteData.email,
  telephone: siteData.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${siteData.address.line1}, ${siteData.address.line2}`,
    addressLocality: siteData.address.suburb,
    addressRegion: siteData.address.state,
    postalCode: siteData.address.postcode,
    addressCountry: "AU",
  },
  sameAs: [siteData.linkedin],
  areaServed: "AU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-navy-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
