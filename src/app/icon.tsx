import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08102a",
          borderRadius: 14,
        }}
      >
        <svg width="40" height="44" viewBox="0 0 100 110">
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
      </div>
    ),
    { ...size },
  );
}
