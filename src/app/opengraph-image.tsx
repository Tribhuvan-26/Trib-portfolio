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
          background: "#0b0b0c",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "sans-serif",
          color: "#ededed",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#9a9aa0",
            letterSpacing: 4,
          }}
        >
          <span>PORTFOLIO</span>
          <span>2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 18,
              color: "#0b0b0c",
              backgroundColor: "#8fa8c9",
              padding: "4px 10px",
              alignSelf: "flex-start",
              letterSpacing: 4,
            }}
          >
            AI/ML · FULL-STACK · IOT
          </div>
          <div
            style={{
              fontSize: 200,
              lineHeight: 0.85,
              fontWeight: 800,
              letterSpacing: -4,
              marginTop: 22,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            tribhuvan
            <span style={{ color: "#8fa8c9" }}>.</span>
          </div>
          <div
            style={{ fontSize: 30, color: "#9a9aa0", marginTop: 18, maxWidth: 980 }}
          >
            AI/ML engineer &amp; full-stack developer — fast, useful,
            real-world software.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#9a9aa0",
            letterSpacing: 4,
          }}
        >
          <span>HYDERABAD, INDIA</span>
          <span>GITHUB / TRIBHUVAN-26</span>
        </div>
      </div>
    ),
    size,
  );
}
