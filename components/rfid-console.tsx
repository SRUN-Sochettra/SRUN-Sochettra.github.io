"use client";

import { useEffect, useRef, useState } from "react";

const states = [
  { id:"01", name:"Idle", headline:"Waiting for credential", display:"READY", detail:"The device remains ready for physical RFID input." },
  { id:"02", name:"Detect", headline:"Credential enters range", display:"CARD FOUND", detail:"The RFID module reads a physical credential." },
  { id:"03", name:"Read", headline:"Credential becomes data", display:"READING...", detail:"The Raspberry Pi Pico receives the credential through MicroPython." },
  { id:"04", name:"Decide", headline:"System evaluates state", display:"CHECKING", detail:"Program logic determines the access-control state." },
  { id:"05", name:"Feedback", headline:"State becomes visible", display:"ACCESS STATE", detail:"The OLED communicates the resulting system state." },
] as const;

export default function RfidConsole() {
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
      root.style.setProperty("--rfid-progress", progress.toFixed(4));
      if (!reduced) setActive(Math.min(states.length - 1, Math.floor(progress * states.length)));
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

  const state = states[active];

  return (
    <section ref={rootRef} className="rfid-console" aria-labelledby="rfid-console-title">
      <div className="rfid-console__sticky">
        <header>
          <p className="field-label">Hardware state machine / RFID</p>
          <h2 id="rfid-console-title">Physical input.<br/><em>Visible state.</em></h2>
          <p>A compact embedded loop from credential detection to OLED feedback.</p>
        </header>

        <div className="rfid-console__device">
          <div className="rfid-console__antenna" aria-hidden="true"><i/><i/><i/></div>
          <div className="rfid-console__card" data-active={active >= 1} aria-hidden="true"><span>RFID</span><b>•••• 0426</b></div>
          <div className="rfid-console__pico" aria-hidden="true">
            <span>PICO</span>
            {Array.from({length:18},(_,index)=><i key={index}/>) }
            <b>MicroPython</b>
          </div>
          <div className="rfid-console__oled" key={state.id} aria-live="polite">
            <span>OLED / STATE {state.id}</span>
            <strong>{state.display}</strong>
            <i aria-hidden="true" />
          </div>
          <svg viewBox="0 0 100 50" className="rfid-console__wiring" aria-hidden="true">
            <defs>
              <filter id="rfid-trace-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".65"/></filter>
              <linearGradient id="rfid-trace" x1="0" x2="1"><stop stopColor="#8be3d9"/><stop offset=".55" stopColor="#baff43"/><stop offset="1" stopColor="#8ef6ff"/></linearGradient>
            </defs>
            <g className="rfid-console__trace-board">
              <path d="M12 19H39Q45 19 45 25V29Q45 35 51 35H78"/>
              <path d="M14 23H36Q41 23 41 28V32Q41 39 48 39H72"/>
              <path d="M50 13V22Q50 27 56 27H83"/>
              <path d="M58 12V20Q58 23 62 23H87"/>
            </g>
            <g className="rfid-console__trace-nodes">
              {[[12,19],[14,23],[50,13],[58,12],[78,35],[72,39],[83,27],[87,23]].map(([x,y],index)=><circle cx={x} cy={y} r=".8" key={index}/>)}
            </g>
            <path className="rfid-console__live-trace" d="M12 19H39Q45 19 45 25V29Q45 35 51 35H78"/>
            <circle className="rfid-console__signal-glow" r="2.4"><animateMotion dur="2.4s" repeatCount="indefinite" path="M12 19H39Q45 19 45 25V29Q45 35 51 35H78"/></circle>
            <circle className="rfid-console__signal-dot" r=".9"><animateMotion dur="2.4s" repeatCount="indefinite" path="M12 19H39Q45 19 45 25V29Q45 35 51 35H78"/></circle>
            <g className="rfid-console__trace-labels"><text x="12" y="16">RFID / SPI</text><text x="73" y="32">OLED / I2C</text></g>
          </svg>
          <div className="rfid-console__readout" key={`readout-${state.id}`}>
            <span>State {state.id} / 05</span><strong>{state.headline}</strong><p>{state.detail}</p>
          </div>
        </div>

        <ol className="rfid-console__states">
          {states.map((item,index)=><li data-active={index===active} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span>{item.name}</button></li>)}
        </ol>
      </div>
    </section>
  );
}
