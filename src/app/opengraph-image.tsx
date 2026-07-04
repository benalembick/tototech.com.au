import { ImageResponse } from "next/og";
import siteData from "@/content/site.json";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #050a17 0%, #08102a 55%, #0b1836 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="58" viewBox="0 0 100 110">
            <defs>
              <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dc4f8" />
                <stop offset="55%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1d4fd8" />
              </linearGradient>
            </defs>
            <path d="M6 4 H60 L48 24 H36 V78 L18 92 V24 H6 Z" fill="#ffffff" />
            <path d="M42 4 H94 L82 24 H64 V78 L58 82 V24 H50 Z" fill="url(#g)" />
          </svg>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#ffffff", letterSpacing: -0.5 }}>
            TOTOTECH
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: -1.5,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Technology Strategy for Organisations Building the Future
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 24,
            color: "#7dc4f8",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {siteData.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
