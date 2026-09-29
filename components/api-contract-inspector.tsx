"use client";

import { useEffect, useRef, useState } from "react";
import { ApiContractVisual } from "@/components/system-visuals";

const stages = [
  { id:"01", name:"Request", title:"Explicit HTTP input", detail:"The route begins with a clear request contract.", artifact:'POST /api/posts\nContent-Type: application/json' },
  { id:"02", name:"Validate", title:"Reject invalid state early", detail:"Validation protects the application boundary before persistence.", artifact:'title: required\ncontent: required' },
  { id:"03", name:"Service", title:"Application behavior", detail:"Spring Boot coordinates the backend workflow behind the route.", artifact:'controller → service\nservice → persistence' },
  { id:"04", name:"Persist", title:"Database-backed state", detail:"Blog data is stored through the application layer in PostgreSQL.", artifact:'INSERT / UPDATE\ntransaction boundary' },
  { id:"05", name:"Respond", title:"Predictable HTTP output", detail:"The API returns an explicit response instead of hiding the result.", artifact:'201 Created\nContent-Type: application/json' },
] as const;

export default function ApiContractInspector() {
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
      root.style.setProperty("--api-progress", progress.toFixed(4));
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

  const stage = stages[active];

  return (
    <section ref={rootRef} className="api-inspector" aria-labelledby="api-inspector-title">
      <div className="api-inspector__sticky">
        <header>
          <p className="field-label">Request-contract inspector</p>
          <h2 id="api-inspector-title">Boring contracts.<br/><em>Reliable behavior.</em></h2>
          <p>A restrained backend trace through request, validation, application behavior, persistence, and response.</p>
        </header>

        <div className="api-inspector__console">
          <div className="api-inspector__toolbar"><span>SPRING BOOT / API TRACE</span><span>JAVA</span><span>POSTGRESQL</span></div>
          <ApiContractVisual active={active} />
          <ol className="api-inspector__pipeline">
            {stages.map((item,index)=><li data-state={index < active ? "complete" : index === active ? "active" : "pending"} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span><i/><b>{item.name}</b></button></li>)}
          </ol>
          <div className="api-inspector__panes">
            <div className="api-inspector__artifact" key={`artifact-${stage.id}`}>
              <span>Trace artifact</span>
              <pre>{stage.artifact}</pre>
            </div>
            <div className="api-inspector__readout" key={`readout-${stage.id}`} aria-live="polite">
              <span>Boundary {stage.id} / 05</span><strong>{stage.title}</strong><p>{stage.detail}</p>
            </div>
          </div>
          <div className="api-inspector__footer"><span>Explicit contracts</span><span>Validation</span><span>Persistence</span><span>Predictable responses</span></div>
        </div>

        <p className="api-inspector__note">Personal learning project / No production-scale or performance claim</p>
      </div>
    </section>
  );
}
