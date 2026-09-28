"use client";

import { useEffect, useRef, useState } from "react";

const levels = [
  { id:"01", name:"Capture", title:"Webcam frame", detail:"OpenCV captures the live camera frame." },
  { id:"02", name:"Track", title:"Hand landmarks", detail:"MediaPipe Hands reads landmarks frame by frame." },
  { id:"03", name:"Pinch", title:"Gesture becomes input", detail:"Thumb-index distance drives grabbing and dropping." },
  { id:"04", name:"Move", title:"Puzzle state changes", detail:"The gesture moves pieces through the game state." },
  { id:"05", name:"Escalate", title:"Progressive levels", detail:"Across five levels, targets become smaller and move faster." },
] as const;

const landmarks = [[22,23],[27,17],[34,15],[41,18],[47,26],[50,36],[46,46],[39,51],[32,48],[28,39],[58,43],[65,39],[70,31],[73,23],[76,15],[61,32],[66,24],[68,16],[69,9],[55,27],[58,19],[59,12]] as const;

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
            {landmarks.slice(0,-1).map(([x,y],index) => {
              const [nx,ny] = landmarks[index + 1];
              return <line x1={x} y1={y} x2={nx} y2={ny} key={`line-${index}`}/>;
            })}
            {landmarks.map(([x,y],index)=><circle cx={x} cy={y} r={index === 4 || index === 18 ? 1.45 : .72} data-pinch={index === 4 || index === 18} key={`point-${index}`}/>)}
            <line className="gesture-lab__pinch-line" x1="47" y1="26" x2="69" y2="9"/>
          </svg>
          <div className="gesture-lab__target" data-active={active >= 3} aria-hidden="true"><i/><span>Target</span></div>
          <div className="gesture-lab__cursor" style={{"--gesture-stage":active} as React.CSSProperties} aria-hidden="true">+</div>
          <div className="gesture-lab__readout" key={level.id} aria-live="polite">
            <span>Stage {level.id} / 05</span><strong>{level.title}</strong><p>{level.detail}</p>
          </div>
          <aside><span>Team credits</span><p>Srun Sochettra, Tep Makara &amp; Sar Chanrithy</p><span>Structure</span><p>Game, vision, renderer, and configuration responsibilities are separated.</p></aside>
        </div>

        <ol className="gesture-lab__levels">
          {levels.map((item,index)=><li data-active={index===active} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span>{item.name}</button></li>)}
        </ol>
      </div>
    </section>
  );
}
