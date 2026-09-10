import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import './styles.css';

type Finding = { id:string; title:string; severity:string; confidence:string; file:string; line:number; description:string; evidence:string; remediation:string };
type Result = { posture:string; filesAnalyzed:number; findings:Finding[] };
const sample = `import { exec } from 'child_process';\nconst password = 'super-secret-value';\nexport function search(input) {\n  const query = "SELECT * FROM users WHERE name = '" + input;\n  eval(input);\n  return query;\n}`;

function ThreatMap({ findings }: { findings: Finding[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#101827');
    const camera = new THREE.PerspectiveCamera(55, 1, .1, 100); camera.position.z = 11;
    const renderer = new THREE.WebGLRenderer({ antialias:true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); ref.current.appendChild(renderer.domElement);
    const group = new THREE.Group(); scene.add(group);
    const colors: Record<string, number> = { Critical:0xef4444, High:0xf97316, Medium:0xeab308, Low:0x22c55e, Informational:0x60a5fa };
    const root = new THREE.Mesh(new THREE.SphereGeometry(.8, 24, 24), new THREE.MeshBasicMaterial({ color:0x8b5cf6, wireframe:true })); group.add(root);
    findings.forEach((f, i) => { const angle = i * Math.PI * 2 / Math.max(findings.length,1); const node = new THREE.Mesh(new THREE.SphereGeometry(.34, 16, 16), new THREE.MeshStandardMaterial({ color:colors[f.severity] ?? 0x94a3b8 })); node.position.set(Math.cos(angle)*3.1, Math.sin(angle)*2.1, Math.sin(i)*1.2); group.add(node); const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), node.position]), new THREE.LineBasicMaterial({ color:colors[f.severity] ?? 0x94a3b8, transparent:true, opacity:.45 })); group.add(line); });
    scene.add(new THREE.AmbientLight(0xffffff, 2)); let frame=0; const animate=()=>{ group.rotation.y += .003; renderer.setSize(ref.current!.clientWidth, ref.current!.clientHeight, false); renderer.render(scene,camera); frame=requestAnimationFrame(animate); }; animate();
    return () => { cancelAnimationFrame(frame); renderer.dispose(); ref.current?.removeChild(renderer.domElement); };
  }, [findings]);
  return <div className="map" ref={ref}><span className="map-label">Code → vulnerabilities</span></div>;
}

function App() { const [source,setSource]=useState(sample); const [result,setResult]=useState<Result|null>(null); const [busy,setBusy]=useState(false); const scan=async()=>{setBusy(true); const response=await fetch('http://localhost:4000/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({files:{'pasted-code.ts':source}})}); setResult(await response.json()); setBusy(false);}; return <main><header><div><div className="eyebrow">SECURE CODE ANALYSIS</div><h1>Code<span>Shield</span></h1></div><div className="badge">MVP · JS / TS</div></header><section className="hero"><div><h2>See risk before it ships.</h2><p>Paste source code and CodeShield will identify security indicators with evidence and remediation guidance.</p></div><div className={`posture ${result?.posture?.replace(' ','-').toLowerCase() ?? 'idle'}`}>{result?.posture ?? 'Ready to scan'}</div></section><section className="workspace"><div className="panel editor"><div className="panel-title">SOURCE CODE <button onClick={()=>setSource('')}>Clear</button></div><textarea value={source} onChange={e=>setSource(e.target.value)} spellCheck={false}/><button className="scan" onClick={scan} disabled={busy}>{busy?'Analyzing…':'Analyze source'}</button></div><div className="panel"><div className="panel-title">3D THREAT MAP</div><ThreatMap findings={result?.findings ?? []}/><div className="legend"><i className="critical"/>Critical <i className="high"/>High <i className="medium"/>Medium <i className="low"/>Low</div></div></section>{result && <section className="panel findings"><div className="panel-title">FINDINGS <small>{result.findings.length} detected · {result.filesAnalyzed} file</small></div>{result.findings.length===0?<p className="empty">No indicators detected.</p>:result.findings.map(f=><article key={f.id}><div className={`severity ${f.severity.toLowerCase()}`}>{f.severity}</div><div className="finding-body"><h3>{f.title}</h3><p>{f.description}</p><code>{f.file}:{f.line} · {f.evidence}</code><strong>Remediation:</strong> {f.remediation}</div></article>)}</section>}</main> }
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
