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
            <path d="M8 10 C28 10 20 26 38 26 S50 40 61 40 S71 54 92 54" pathLength="1" />
            <circle className="thnal-workflow__packet" r="1.35"><animateMotion dur="4s" repeatCount="indefinite" path="M8 10 C28 10 20 26 38 26 S50 40 61 40 S71 54 92 54"/></circle>
            {[[8,10],[30,22],[50,34],[70,46],[92,54]].map(([x,y],index)=><g data-state={index < active ? "complete" : index === active ? "active" : "pending"} transform={`translate(${x} ${y})`} key={index}><circle r="3.2"/><text y="7" textAnchor="middle">{phases[index].name}</text></g>)}
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
