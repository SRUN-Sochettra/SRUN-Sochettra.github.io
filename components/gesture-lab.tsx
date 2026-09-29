"use client";

import { useEffect, useRef, useState } from "react";

const levels = [
  { id:"01", name:"Capture", title:"Webcam frame", detail:"OpenCV captures the live camera frame." },
  { id:"02", name:"Track", title:"Hand landmarks", detail:"MediaPipe Hands reads landmarks frame by frame." },
  { id:"03", name:"Pinch", title:"Gesture becomes input", detail:"Thumb-index distance drives grabbing and dropping." },
  { id:"04", name:"Move", title:"Puzzle state changes", detail:"The gesture moves pieces through the game state." },
  { id:"05", name:"Escalate", title:"Progressive levels", detail:"Across five levels, targets become smaller and move faster." },
] as const;

const landmarks = [
  [48,56], [38,49], [31,38], [27,27], [24,17],
  [42,39], [40,27], [40,16], [40,7],
  [50,37], [51,23], [52,11], [53,3],
  [59,39], [63,27], [67,17], [70,10],
  [67,45], [74,38], [80,31], [85,26],
] as const;
const handBones = [
  [0,1],[1,2],[2,3],[3,4], [0,5],[5,6],[6,7],[7,8],
  [5,9],[9,10],[10,11],[11,12], [9,13],[13,14],[14,15],[15,16],
  [13,17],[17,18],[18,19],[19,20], [0,17],
] as const;
export default function GestureLab() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(root.offsetHeight - innerHeight, 1);
      const progress = Math.max(0, Math.min(.999, -rect.top / travel));
      root.style.setProperty("--gesture-progress", progress.toFixed(4));
      if (!reduced) setActive(Math.min(levels.length - 1, Math.floor(progress * levels.length)));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive:true });
    addEventListener("resize", onScroll, { passive:true });
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const level = levels[active];

  return (
    <section ref={rootRef} className="gesture-lab" aria-labelledby="gesture-lab-title">
      <div className="gesture-lab__sticky">
        <header>
          <p className="field-label">Vision input laboratory</p>
          <h2 id="gesture-lab-title">The controller<br/><em>is your hand.</em></h2>
          <p>A camera frame becomes landmarks, a pinch, and finally a puzzle action.</p>
        </header>

        <div className="gesture-lab__camera">
          <div className="gesture-lab__hud"><span>CAM 01 / LIVE</span><span>MEDIAPIPE HANDS</span><span>LEVEL 0{active + 1}</span></div>
          <svg className="gesture-lab__hand" viewBox="0 0 100 64" role="img" aria-label={`Gesture pipeline stage: ${level.name}`}>
            <defs>
              <filter id="hand-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <radialGradient id="hand-node" cx="35%" cy="30%">
                <stop offset="0" stopColor="#f4f1e8"/><stop offset="1" stopColor="#baff43"/>
              </radialGradient>
            </defs>
            <g className="gesture-lab__reticle" aria-hidden="true">
              <circle cx="50" cy="32" r="27"/><circle cx="50" cy="32" r="19"/>
              <path d="M50 1v7M50 56v7M19 32h7M74 32h7"/>
            </g>
            <g className="gesture-lab__skeleton" filter="url(#hand-glow)">
              {handBones.map(([from,to],index) => {
                const [x1,y1] = landmarks[from];
                const [x2,y2] = landmarks[to];
                return <line x1={x1} y1={y1} x2={x2} y2={y2} style={{"--bone-index": index} as React.CSSProperties} key={`bone-${index}`}/>;
              })}
              {landmarks.map(([x,y],index)=><circle cx={x} cy={y} r={index === 4 || index === 8 ? 1.55 : .78} data-pinch={index === 4 || index === 8} style={{"--node-index": index} as React.CSSProperties} key={`point-${index}`}/>)}
              <line className="gesture-lab__pinch-line" x1="24" y1="17" x2="40" y2="7"/>
            </g>
            <g className="gesture-lab__telemetry" aria-hidden="true">
              <path d="M5 9h12M5 9v9M95 9H83M95 9v9M5 55h12M5 55v-9M95 55H83M95 55v-9"/>
              <text x="6" y="6">HAND / 01</text><text x="94" y="61" textAnchor="end">21 LANDMARKS</text>
            </g>
          </svg>
          <div className="gesture-lab__target" data-active={active >= 3} aria-hidden="true"><i/><span>Target</span></div>
          <div className="gesture-lab__cursor" style={{"--gesture-stage":active} as React.CSSProperties} aria-hidden="true">+</div>
          <div className="gesture-lab__readout" key={level.id} aria-live="polite">
            <span>Stage {level.id} / 05</span><strong>{level.title}</strong><p>{level.detail}</p>
          </div>
          <aside><span>Team credits</span><p>Srun Sochettra, Tep Makara & Sar Chanrithy</p><span>Structure</span><p>Game, vision, renderer, and configuration responsibilities are separated.</p></aside>
        </div>

        <ol className="gesture-lab__levels">
          {levels.map((item,index)=><li data-active={index===active} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span>{item.name}</button></li>)}
        </ol>
      </div>
    </section>
  );
}
