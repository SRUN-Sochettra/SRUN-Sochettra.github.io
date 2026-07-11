import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#121515",
        color: "#F2EEE6",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#B8D86A",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        SRUN / SYSTEMS IN MOTION
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 82,
            lineHeight: 1,
            letterSpacing: "-0.045em",
            fontWeight: 700,
          }}
        >
          <span>Building practical software</span>
          <span>from database to interface.</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#D8D0C2",
            marginTop: 32,
          }}
        >
          Srun Sochettra · Full-Stack Developer
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: 8,
          width: "100%",
          background: "#B9653B",
        }}
      />
    </div>,
    size,
  );
}
