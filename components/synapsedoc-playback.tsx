"use client";

import { useEffect, useRef, useState } from "react";

const stages = [
  { id:"01", name:"Ingest", label:"Uploaded document", detail:"A source enters the research workspace." },
  { id:"02", name:"Retrieve", label:"Relevant context", detail:"Document passages are selected for the question." },
  { id:"03", name:"Rerank", label:"Cohere ordering", detail:"Retrieved context is reordered before generation." },
  { id:"04", name:"Route", label:"Bounded fallback", detail:"Gemini, Groq, and Mistral use controlled sequential routing." },
  { id:"05", name:"Stream", label:"SSE response", detail:"The answer arrives progressively while the conversation persists." },
  { id:"06", name:"Cite", label:"Grounded answer", detail:"Messages and citations remain connected to retrieved passages." },
] as const;

export default function SynapseDocPlayback() {
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
      root.style.setProperty("--playback-progress", progress.toFixed(4));
      if (!reduced) setActive(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
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

  return (
    <section ref={rootRef} className="architecture-playback" aria-labelledby="architecture-playback-title">
      <div className="architecture-playback__sticky">
        <header>
          <p className="field-label">Architecture playback / SynapseDoc</p>
          <h2 id="architecture-playback-title">Follow one answer<br/><em>back to its evidence.</em></h2>
          <p>The active stage changes with scroll. Previous stages remain visible as system history.</p>
        </header>

        <div className="architecture-playback__machine" style={{ "--active-stage":active } as React.CSSProperties}>
          <div className="architecture-playback__beam" aria-hidden="true" />
          <ol>
            {stages.map((stage,index) => (
              <li data-state={index < active ? "complete" : index === active ? "active" : "pending"} key={stage.id}>
                <button type="button" onClick={()=>setActive(index)} aria-current={index === active ? "step" : undefined}>
                  <span>{stage.id}</span><i/><b>{stage.name}</b>
                </button>
              </li>
            ))}
          </ol>
          <div className="architecture-playback__readout" key={stages[active].id} aria-live="polite">
            <span>Stage {stages[active].id} / {String(stages.length).padStart(2,"0")}</span>
            <strong>{stages[active].label}</strong>
            <p>{stages[active].detail}</p>
          </div>
          <div className="architecture-playback__boundary">
            <span>Verified boundary</span>
            <p>Bounded production upload → ready → chat → citation → persistence flow exercised.</p>
            <span>Known limit</span>
            <p>Broad load and failover resilience remain unproven.</p>
          </div>
        </div>

        <div className="architecture-playback__chapters" aria-hidden="true">
          {stages.map((stage,index)=><span data-active={index===active} key={stage.id}>{stage.id}</span>)}
        </div>
      </div>
    </section>
  );
}
