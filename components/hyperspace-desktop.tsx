"use client";

import { useEffect, useRef, useState } from "react";

const scenes = [
  { id:"01", name:"Shell", title:"Desktop metaphor", detail:"The browser becomes a desktop-like interaction surface." },
  { id:"02", name:"Window", title:"Composable windows", detail:"Windows behave as reusable interface structures." },
  { id:"03", name:"App", title:"Applications inside the shell", detail:"Applications share the same interaction environment." },
  { id:"04", name:"Navigate", title:"Desktop navigation", detail:"Navigation connects windows and applications inside one interface." },
  { id:"05", name:"System", title:"Reusable interaction language", detail:"The experiment turns desktop patterns into a browser UI system." },
] as const;

export default function HyperspaceDesktop() {
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
      root.style.setProperty("--desktop-progress", progress.toFixed(4));
      if (!reduced) setActive(Math.min(scenes.length - 1, Math.floor(progress * scenes.length)));
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

  const scene = scenes[active];

  return (
    <section ref={rootRef} className="hyperspace-desktop" aria-labelledby="hyperspace-desktop-title">
      <div className="hyperspace-desktop__sticky">
        <header>
          <p className="field-label">Browser desktop / HyperspaceOS</p>
          <h2 id="hyperspace-desktop-title">A browser that<br/><em>behaves like a place.</em></h2>
          <p>Windows, applications, and navigation become one reusable interaction system.</p>
        </header>

        <div className="hyperspace-desktop__screen">
          <div className="hyperspace-desktop__wallpaper" aria-hidden="true"><i/><i/><i/></div>
          <div className="hyperspace-desktop__menubar"><span>HYPERSPACE</span><span>Workspace 01</span><span>React / TypeScript</span></div>
          <div className="hyperspace-window hyperspace-window--files" data-active={active >= 0}>
            <div><span>● ● ●</span><b>Navigator</b></div><ul><li>Desktop</li><li>Applications</li><li>Windows</li><li>System</li></ul>
          </div>
          <div className="hyperspace-window hyperspace-window--main" data-active={active >= 1}>
            <div><span>● ● ●</span><b>{scene.name}.app</b></div>
            <main key={scene.id}><span>Scene {scene.id} / 05</span><strong>{scene.title}</strong><p>{scene.detail}</p></main>
          </div>
          <div className="hyperspace-window hyperspace-window--utility" data-active={active >= 2}>
            <div><span>● ● ●</span><b>System</b></div><dl><dt>Mode</dt><dd>{scene.name}</dd><dt>Surface</dt><dd>Browser</dd><dt>State</dt><dd>Active</dd></dl>
          </div>
          <div className="hyperspace-desktop__dock" aria-label="Desktop applications"><button>⌘</button><button>□</button><button>◇</button><button>+</button></div>
        </div>

        <ol className="hyperspace-desktop__scenes">
          {scenes.map((item,index)=><li data-active={index===active} key={item.id}><button type="button" onClick={()=>setActive(index)}><span>{item.id}</span>{item.name}</button></li>)}
        </ol>
      </div>
    </section>
  );
}
