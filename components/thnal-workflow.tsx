"use client";

import { useEffect, useRef, useState } from "react";

const phases = [
  { id:"01", name:"Listen", title:"External workflow", detail:"Requirements begin with the organization rather than a fictional portfolio scenario." },
  { id:"02", name:"Structure", title:"Information model", detail:"Organizational information becomes a database-backed structure." },
  { id:"03", name:"Build", title:"Full-stack workflow", detail:"The website connects interface behavior to persisted records." },
  { id:"04", name:"Validate", title:"Usable management flow", detail:"The capstone is presented around the real workflow it was built to support." },
  { id:"05", name:"Bound", title:"Private client work", detail:"Source, usage, scale, deployment, and measured impact are not claimed." },
] as const;

export default function ThnalWorkflow() {
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
      root.style.setProperty("--workflow-progress", progress.toFixed(4));
      if (!reduced) setActive(Math.min(phases.length - 1, Math.floor(progress * phases.length)));
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

  const phase = phases[active];

  return (
    <section ref={rootRef} className="thnal-workflow" aria-labelledby="thnal-workflow-title">
      <div className="thnal-workflow__sticky">
        <header>
          <p className="field-label">Client workflow / Thnal system</p>
          <h2 id="thnal-workflow-title">Not a mock brief.<br/><em>A real organization.</em></h2>
          <p>The sequence shows how an external workflow became a database-backed capstone without overstating the evidence.</p>
        </header>

        <div className="thnal-workflow__board">
          <div className="thnal-workflow__lanes" aria-hidden="true">
            <span>Organization</span><span>Interface</span><span>Application</span><span>Database</span><span>Evidence</span>
          </div>
          <svg className="thnal-workflow__route" viewBox="0 0 100 64" role="img" aria-label={`Active workflow phase: ${phase.name}`}>
            <defs>
              <linearGradient id="thnal-route-gradient" x1="0" x2="1">
                <stop offset="0" stopColor="#67d9ff"/><stop offset=".52" stopColor="#f4f1e8"/><stop offset="1" stopColor="#67d9ff"/>
              </linearGradient>
              <filter id="thnal-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.1"/></filter>
              <marker id="thnal-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0l6 3-6 3z" fill="#67d9ff"/></marker>
            </defs>
            <g className="thnal-workflow__grid" aria-hidden="true">
              {[20,40,60,80].map(x=><line x1={x} y1="5" x2={x} y2="59" key={`v-${x}`}/>)}
              {[16,32,48].map(y=><line x1="4" y1={y} x2="96" y2={y} key={`h-${y}`}/>)}
            </g>
            <path className="thnal-workflow__route-shadow" d="M8 12 C21 12 22 22 31 22 S43 32 50 32 S61 43 69 43 S80 54 92 54"/>
            <path className="thnal-workflow__route-main" d="M8 12 C21 12 22 22 31 22 S43 32 50 32 S61 43 69 43 S80 54 92 54" pathLength="1" markerEnd="url(#thnal-arrow)"/>
            <circle className="thnal-workflow__packet-glow" r="3"><animateMotion dur="4s" repeatCount="indefinite" path="M8 12 C21 12 22 22 31 22 S43 32 50 32 S61 43 69 43 S80 54 92 54"/></circle>
            <circle className="thnal-workflow__packet" r="1.25"><animateMotion dur="4s" repeatCount="indefinite" path="M8 12 C21 12 22 22 31 22 S43 32 50 32 S61 43 69 43 S80 54 92 54"/></circle>
            {[[8,12],[30,22],[50,32],[70,43],[92,54]].map(([x,y],index)=><g className="thnal-workflow__node" data-state={index < active ? "complete" : index === active ? "active" : "pending"} transform={`translate(${x} ${y})`} key={index}>
              <rect x="-5.4" y="-4" width="10.8" height="8" rx="1.2"/><circle r="1.35"/>
              <text y="8" textAnchor="middle">0{index + 1} / {phases[index].name}</text>
            </g>)}
            <g className="thnal-workflow__legend" aria-hidden="true"><circle cx="8" cy="58" r=".8"/><text x="11" y="59">VERIFIED FLOW</text></g>
          </svg>
          <div className="thnal-workflow__record" key={phase.id} aria-live="polite">
            <span>Workflow {phase.id} / 05</span>
            <strong>{phase.title}</strong>
            <p>{phase.detail}</p>
          </div>
          <aside>
            <div><span>Context</span><b>Team client project</b></div>
            <div><span>Client</span><b>Cambodian Youth Nursery Association</b></div>
            <div><span>Visibility</span><b>Private</b></div>
          </aside>
        </div>

        <ol className="thnal-workflow__phases">
          {phases.map((item,index)=><li data-active={index===active} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span>{item.name}</button></li>)}
        </ol>
      </div>
    </section>
  );
}
