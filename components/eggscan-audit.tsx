"use client";

import { useEffect, useRef, useState } from "react";
import { EggScanVisual } from "@/components/system-visuals";

const modes = [
  { id:"01", name:"Profile", input:"Profile + contributions", output:"Readable scoring and feedback" },
  { id:"02", name:"Battle", input:"Two developer profiles", output:"Comparable evidence flow" },
  { id:"03", name:"Repository", input:"Repository signals", output:"Deep-dive analysis" },
  { id:"04", name:"Commit", input:"Commit messages", output:"Focused evaluation" },
  { id:"05", name:"README", input:"Repository documentation", output:"README assessment" },
  { id:"06", name:"Stack", input:"Detected technologies", output:"Stack analysis" },
] as const;

export default function EggScanAudit() {
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
      root.style.setProperty("--audit-progress", progress.toFixed(4));
      if (!reduced) setActive(Math.min(modes.length - 1, Math.floor(progress * modes.length)));
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

  const mode = modes[active];

  return (
    <section ref={rootRef} className="eggscan-audit" aria-labelledby="eggscan-audit-title">
      <div className="eggscan-audit__sticky">
        <header>
          <p className="field-label">Analysis chamber / EggScan</p>
          <h2 id="eggscan-audit-title">Raw GitHub data.<br/><em>Readable evidence.</em></h2>
          <p>The suite changes lenses without changing the evidence boundary.</p>
        </header>

        <div className="eggscan-audit__terminal">
          <div className="eggscan-audit__scan" aria-hidden="true" />
          <EggScanVisual active={active} />
          <div className="eggscan-audit__matrix" aria-hidden="true">
            {Array.from({length:24},(_,index)=><i style={{"--cell":index} as React.CSSProperties} key={index}/>) }
          </div>
          <div className="eggscan-audit__mode" key={mode.id} aria-live="polite">
            <span>Mode {mode.id} / 06</span>
            <strong>{mode.name}</strong>
            <dl><div><dt>Input</dt><dd>{mode.input}</dd></div><div><dt>Output</dt><dd>{mode.output}</dd></div></dl>
          </div>
          <div className="eggscan-audit__pipeline" aria-label="Analysis boundary">
            <span data-active={true}>GitHub GraphQL</span><i>→</i><span data-active={active >= 1}>Spring Boot</span><i>→</i><span data-active={active >= 3}>Groq analysis</span><i>→</i><span data-active={active >= 5}>Human-readable verdict</span>
          </div>
          <aside>
            <span>AI boundary</span>
            <p>Model output is analysis, not verified fact about a developer.</p>
            <span>Runtime boundary</span>
            <p>Live provider behavior still requires runtime verification.</p>
          </aside>
        </div>

        <ol className="eggscan-audit__modes">
          {modes.map((item,index)=><li data-active={index===active} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span>{item.name}</button></li>)}
        </ol>
      </div>
    </section>
  );
}
