
import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export const alt = "Srun Sochettra — Systems in Motion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#f0ede5", color: "#151612", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}><span>SRUN—26</span><span>Phnom Penh</span></div>
      <div style={{ display: "flex", fontSize: 132, fontWeight: 800, letterSpacing: -8 }}>SYSTEMS IN MOTION</div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #c83b2b", paddingTop: 20, fontSize: 26 }}><span>Srun Sochettra</span><span>Full-Stack Developer</span></div>
    </div>,
    size,
  );
}
