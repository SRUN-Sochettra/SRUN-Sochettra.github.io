"use client";

export function SynapseEvidenceVisual({ active }: { active: number }) {
  const nodes = [[8,32],[24,18],[40,32],[56,16],[72,32],[92,20]];
  return <svg className="system-visual system-visual--synapse" viewBox="0 0 100 48" role="img" aria-label="Evidence moving through the SynapseDoc retrieval pipeline">
    <defs><linearGradient id="synapse-flow" x1="0" x2="1"><stop stopColor="#7c5cff"/><stop offset=".55" stopColor="#59dfff"/><stop offset="1" stopColor="#baff43"/></linearGradient><filter id="synapse-glow"><feGaussianBlur stdDeviation="1.1"/></filter></defs>
    <g className="system-visual__grid">{[10,20,30,40,50,60,70,80,90].map(x=><line x1={x} y1="4" x2={x} y2="44" key={x}/>)}{[12,24,36].map(y=><line x1="4" y1={y} x2="96" y2={y} key={y}/>)}</g>
    <path className="system-visual__ghost" d="M8 32L24 18L40 32L56 16L72 32L92 20"/>
    <path className="system-visual__flow" d="M8 32L24 18L40 32L56 16L72 32L92 20" pathLength="1"/>
    {nodes.map(([x,y],i)=><g className="system-visual__node" data-state={i<active?"complete":i===active?"active":"pending"} transform={`translate(${x} ${y})`} key={i}><circle r="3.2"/><circle r="1"/><text y="7" textAnchor="middle">0{i+1}</text></g>)}
    <circle className="system-visual__pulse" r="1.3"><animateMotion dur="4.8s" repeatCount="indefinite" path="M8 32L24 18L40 32L56 16L72 32L92 20"/></circle>
    <text className="system-visual__label" x="4" y="7">EVIDENCE GRAPH / GROUNDED PATH</text>
  </svg>;
}

export function EggScanVisual({ active }: { active: number }) {
  const bars=[14,24,18,33,27,38,22,31,17,36,26,40];
  return <svg className="system-visual system-visual--egg" viewBox="0 0 100 48" role="img" aria-label="EggScan repository signal analysis display">
    <defs><linearGradient id="egg-wave" x1="0" x2="1"><stop stopColor="#ffb74d"/><stop offset=".55" stopColor="#ff4935"/><stop offset="1" stopColor="#f4f1e8"/></linearGradient><clipPath id="egg-shell"><path d="M50 5C37 5 28 24 28 34c0 8 9 11 22 11s22-3 22-11C72 24 63 5 50 5z"/></clipPath></defs>
    <g clipPath="url(#egg-shell)" className="eggscan-spectrum">{bars.map((h,i)=><rect x={29+i*3.7} y={44-h} width="2.4" height={h} style={{"--bar":i} as React.CSSProperties} key={i}/>)}</g>
    <path className="eggscan-shell" d="M50 5C37 5 28 24 28 34c0 8 9 11 22 11s22-3 22-11C72 24 63 5 50 5z"/>
    <path className="eggscan-wave" d="M5 29h13l4-8 5 17 5-11 5 4 5-10 5 15 5-8 5 5 5-14 5 19 5-10 5 3h14"/>
    <g className="eggscan-reticle"><path d="M20 8h10M20 8v8M80 8H70M80 8v8M20 42h10M20 42v-8M80 42H70M80 42v-8"/><circle cx="50" cy="27" r={7+active}/></g>
    <text className="system-visual__label" x="4" y="7">REPOSITORY SIGNAL / MODE 0{active+1}</text><text className="system-visual__label" x="96" y="45" textAnchor="end">HUMAN REVIEW REQUIRED</text>
  </svg>;
}

export function HyperspaceVisual({ active }: { active: number }) {
  return <svg className="system-visual system-visual--hyper" viewBox="0 0 100 48" role="img" aria-label="HyperspaceOS spatial window map">
    <defs><radialGradient id="hyper-core"><stop stopColor="#e8f7ff"/><stop offset=".18" stopColor="#67d9ff"/><stop offset="1" stopColor="#221b58" stopOpacity="0"/></radialGradient></defs>
    <g className="hyper-orbits"><ellipse cx="50" cy="25" rx="38" ry="14"/><ellipse cx="50" cy="25" rx="27" ry="20" transform="rotate(-18 50 25)"/><ellipse cx="50" cy="25" rx="17" ry="8" transform="rotate(28 50 25)"/></g>
    <circle className="hyper-core" cx="50" cy="25" r="9" fill="url(#hyper-core)"/>
    {[[17,22],[36,9],[66,12],[84,30]].map(([x,y],i)=><g className="hyper-app" data-state={i<=active?"active":"pending"} transform={`translate(${x} ${y})`} key={i}><rect x="-6" y="-4" width="12" height="8" rx="1"/><path d="M-4-1h8M-4 1h5"/></g>)}
    <path className="hyper-cursor" d={`M${22+active*18} ${38-active*4}l6 12 2-5 5-2z`}/>
    <text className="system-visual__label" x="4" y="7">SPATIAL DESKTOP / WORKSPACE 01</text><text className="system-visual__label" x="96" y="45" textAnchor="end">SCENE 0{active+1}</text>
  </svg>;
}

export function ApiContractVisual({ active }: { active: number }) {
  const layers=[{x:7,w:15,l:"HTTP"},{x:27,w:15,l:"DTO"},{x:47,w:15,l:"APP"},{x:67,w:15,l:"SQL"},{x:87,w:9,l:"200"}];
  return <svg className="system-visual system-visual--api" viewBox="0 0 100 48" role="img" aria-label="Spring Boot request contract boundary map">
    <defs><marker id="api-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0l6 3-6 3z"/></marker><linearGradient id="api-flow" x1="0" x2="1"><stop stopColor="#baff43"/><stop offset="1" stopColor="#67d9ff"/></linearGradient></defs>
    <g className="api-contract-flow"><path d="M8 25H94" markerEnd="url(#api-arrow)"/><path d="M94 34H8" markerEnd="url(#api-arrow)"/></g>
    {layers.map((layer,i)=><g className="api-contract-layer" data-state={i<active?"complete":i===active?"active":"pending"} transform={`translate(${layer.x} 0)`} key={layer.l}><rect y="15" width={layer.w} height="18" rx="1.5"/><text x={layer.w/2} y="25.5" textAnchor="middle">{layer.l}</text><circle cx={layer.w/2} cy="38" r="1"/></g>)}
    <g className="api-contract-packet"><rect x={9+active*20} y="20" width="5" height="4" rx=".7"/><text x={11.5+active*20} y="23" textAnchor="middle">{active===4?"OK":"{}"}</text></g>
    <text className="system-visual__label" x="4" y="7">REQUEST CONTRACT / TRACE 0{active+1}</text><text className="system-visual__label" x="96" y="45" textAnchor="end">VALIDATED BOUNDARIES</text>
  </svg>;
}
