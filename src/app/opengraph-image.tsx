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
          background: "#ebe9e2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "sans-serif",
          color: "#14181f",
          position: "relative",
        }}
      >
        {/* hazard stripe top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            backgroundImage:
              "repeating-linear-gradient(135deg, #ffb800 0 14px, #14181f 14px 28px)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#4f5663",
            letterSpacing: 4,
            marginTop: 14,
          }}
        >
          <span>PILOT 01 // IDENTITY</span>
          <span>JAEGER MK-III</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 18,
              color: "#14181f",
              backgroundColor: "#ffb800",
              padding: "4px 10px",
              alignSelf: "flex-start",
              letterSpacing: 4,
            }}
          >
            001 / OPERATOR DOSSIER
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
            <span style={{ color: "#ffb800" }}>.</span>
          </div>
          <div
            style={{ fontSize: 30, color: "#4f5663", marginTop: 18, maxWidth: 980 }}
          >
            AI/ML engineer &amp; full-stack pilot — research-flavored systems
            that ship.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#4f5663",
            letterSpacing: 4,
            marginBottom: 14,
          }}
        >
          <span>SHATTERDOME // BUILT IN THE BAY</span>
          <span>GITHUB / TRIBHUVAN-26</span>
        </div>

        {/* hazard stripe bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 14,
            backgroundImage:
              "repeating-linear-gradient(135deg, #ffb800 0 14px, #14181f 14px 28px)",
          }}
        />
      </div>
    ),
    size,
  );
}
