import { ImageResponse } from "next/og";

export const alt = "Tribhuvan — AI/ML Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#050810",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#9aa3b2", letterSpacing: 4 }}>
          <span>● available</span>
          <span>portfolio · v2</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 18, color: "#4a5365", letterSpacing: 6 }}>
            001 — INDEX
          </div>
          <div
            style={{
              fontSize: 200,
              lineHeight: 0.92,
              fontWeight: 800,
              letterSpacing: -4,
              marginTop: 18,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            tribhuvan
            <span style={{ color: "#1f9bff" }}>.</span>
          </div>
          <div style={{ fontSize: 32, color: "#9aa3b2", marginTop: 16, maxWidth: 900 }}>
            ai/ml engineer & full-stack developer — building research-flavored
            products.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: "#4a5365", letterSpacing: 4 }}>
          <span>tribhuvan-26 · github</span>
          <span>2026</span>
        </div>
      </div>
    ),
    size,
  );
}
