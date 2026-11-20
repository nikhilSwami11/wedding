import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { content as c } from "../content";

const mehendi = c.events.find((e) => e.id === "mehendi")!;
const haldi = c.events.find((e) => e.id === "haldi")!;

/** Seeded random so the powder looks the same every time. */
const rng = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const GRAINS = (() => {
  const r = rng(11);
  return Array.from({ length: 420 }, () => ({ a: r() * Math.PI, off: (r() ** 2.2) * 150 - 24, s: .6 + r() * 3.4, o: .25 + r() * .75, tone: r(), drift: r() }));
})();

/** Turmeric powder: a grainy, drifting cloud along the leading edge of the splash, drawn from scroll progress only. */
function Powder({ radius }: { radius: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = (rPct: number) => {
    const cv = ref.current; if (!cv) return;
    const w = cv.clientWidth, h = cv.clientHeight, dpr = Math.min(1.25, window.devicePixelRatio || 1);
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    const g = cv.getContext("2d"); if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    if (rPct <= 0 || rPct > 148) return;
    const R = (rPct / 100) * Math.sqrt((w * w + h * h) / 2), cx = w / 2, cy = h * 1.05;
    for (const p of GRAINS) {
      const ang = Math.PI + p.a; // upper half-circle
      const rr = R + p.off + p.drift * rPct * .35;
      const x = cx + Math.cos(ang) * rr, y = cy + Math.sin(ang) * rr;
      if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
      g.globalAlpha = p.o * (p.off > 40 ? .55 : 1);
      g.fillStyle = p.tone > .66 ? "#ffd84a" : p.tone > .33 ? "#f2a91c" : "#e0900f";
      g.beginPath(); g.arc(x, y, p.s, 0, 6.283); g.fill();
    }
    g.globalAlpha = 1;
  };
  useEffect(() => { draw(radius.get()); const f = () => draw(radius.get()); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); });
  useMotionValueEvent(radius, "change", draw);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-30 h-full w-full" aria-hidden="true" />;
}

/** One henna stroke that draws itself between scroll progress a → b. */
function Stroke({ d, p, a, b, w = 2.4, dash }: { d: string; p: MotionValue<number>; a: number; b: number; w?: number; dash?: string }) {
  const len = useTransform(p, [a, b], [0, 1]);
  return <motion.path d={d} fill="none" stroke="#d98a3d" strokeWidth={w} strokeLinecap="round" strokeDasharray={dash} style={{ pathLength: len }} />;
}
function Dot({ x, y, r = 3, p, a }: { x: number; y: number; r?: number; p: MotionValue<number>; a: number }) {
  const o = useTransform(p, [a, a + 0.02], [0, 1]);
  return <motion.circle cx={x} cy={y} r={r} fill="#d98a3d" style={{ opacity: o }} />;
}

/** Paisley outline pointing up-left; drawn at (x,y) with scale s and optional mirror. */
const PAISLEY = "M0 0C-26-6-40-34-22-56C-6-76 24-66 26-40C28-20 14-6 0 0Z M-6-22C-12-34 0-46 8-36";

/** One small painted piece. Drifts at its own speed as you scroll; silently skipped if the file is not there yet. */
function Layer({ L, p }: { L: (typeof c.mehendiLayers)[number]; p: MotionValue<number> }) {
  const [ok, setOk] = useState(true);
  const y = useTransform(p, [0, .7], [0, -L.depth * 160]);
  const o = useTransform(p, [.05, .18, .56, .66], [0, 1, 1, 0]);
  const sc = useTransform(p, [.05, .22], [.85, 1]);
  if (!ok) return null;
  return (
    <motion.img src={L.src} alt="" onError={() => setOk(false)} draggable={false}
      className={`pointer-events-none absolute h-auto will-change-transform ${L.z ? "z-[8]" : "z-0"}`}
      style={{ left: `${L.x}%`, top: `${L.y}%`, width: `${L.w}%`, x: "-50%", y, opacity: o, scale: sc, rotate: L.rot ?? 0, translateY: "-50%" }} />
  );
}

/** Concentric lotus petals that draw themselves behind the arch: one path per ring, so only 4 values animate. */
const rot = (x: number, y: number, deg: number) => { const r = (deg * Math.PI) / 180, c = Math.cos(r), n = Math.sin(r); return `${(x * c - y * n).toFixed(1)} ${(x * n + y * c).toFixed(1)}`; };
const petal = (deg: number) => `M${rot(0, -60, deg)}C${rot(9, -85, deg)} ${rot(9, -110, deg)} ${rot(0, -135, deg)}C${rot(-9, -110, deg)} ${rot(-9, -85, deg)} ${rot(0, -60, deg)}Z`;
const RINGS = [{ n: 12, s: .92, a: .02, b: .26 }, { n: 18, s: 1.14, a: .08, b: .31 }, { n: 24, s: 1.36, a: .14, b: .36 }].map((r, ri) => ({ ...r, d: Array.from({ length: r.n }, (_, i) => petal((i * 360) / r.n + (ri % 2 ? 180 / r.n : 0))).join("") }));
function Mandala({ p }: { p: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {RINGS.map((r, ri) => (
        <g key={ri} transform={`translate(200 320) scale(${r.s})`}><Stroke d={r.d} p={p} a={r.a} b={r.b} w={1.5 / r.s} /></g>
      ))}
      <Stroke d="M200 130a190 190 0 1 1-.1 0" p={p} a={.04} b={.34} w={1.2} dash="2 8" />
    </svg>
  );
}

/** Scene: henna draws itself on scroll, then a turmeric splash opens onto the Haldi painting. */
export default function RitualsScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const mehO = useTransform(p, [.3, .38, .6, .68], [0, 1, 1, 0]);
  const mehY = useTransform(p, [.3, .38], ["16px", "0px"]);
  const arch = useTransform(p, [.26, .42], [0, 1]);
  const splash = useTransform(p, [.64, .9], [0, 150]);
  const mandalaTurn = useTransform(p, [0, .6], [-8, 14]);
  // The turmeric splash is an "iris": a big round window that GROWS with transform (GPU), instead of an animated clip-path
  // (which repaints the whole screen every frame). The painting inside is counter-scaled so it never looks zoomed.
  const [vp, setVp] = useState({ w: 1200, h: 800 });
  useEffect(() => { const f = () => setVp({ w: window.innerWidth, h: window.innerHeight }); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const D = 3 * Math.sqrt((vp.w * vp.w + vp.h * vp.h) / 2); // diameter when splash = 150%
  const irisS = useTransform(splash, [0, 150], [0, 1]);
  const irisInv = useTransform(irisS, (v) => 1 / Math.max(v, .001));
  const halO = useTransform(p, [.84, .92], [0, 1]);
  const halY = useTransform(p, [.84, .92], ["16px", "0px"]);
  const hint = useTransform(p, [0, .06], [1, 0]);

  const vine = "M200 760C110 690 290 630 200 550S110 410 200 330S290 210 200 110";
  return (
    <section ref={ref} className="relative h-[400vh]" aria-label="Mehendi and Haldi">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* MEHENDI: henna draws itself */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 55% at 50% 42%, rgba(12,52,51,.62), rgba(12,52,51,.15) 75%, transparent)" }} />
        <div className="absolute inset-0 opacity-[.07]" style={{ backgroundImage: "url(/art/lattice.webp)", backgroundSize: "480px" }} />
        <div className="absolute inset-y-0 left-1/2 w-[min(100vw,50svh)] -translate-x-1/2">
        <motion.div className="absolute inset-0 will-change-transform" style={{ rotate: mandalaTurn, transformOrigin: "50% 40%" }}><Mandala p={p} /></motion.div>
        {c.mehendiLayers.filter((L) => L.z === 0).map((L, i) => <Layer key={`b${i}`} L={L} p={p} />)}
        <motion.div className="absolute left-1/2 top-[14%] z-[1] h-[52%] w-[52%] max-w-[260px] -translate-x-1/2 overflow-hidden rounded-t-[999px] rounded-b-xl ring-2 ring-[#e6c280]/70" style={{ opacity: arch }}>
          <img src={mehendi.art} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0c3433]/35" />
        </motion.div>
        <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 z-[2] h-full w-full" aria-hidden="true">
          <Stroke d={vine} p={p} a={0.02} b={0.3} w={3} />
          {/* paisleys climbing the vine, left and right */}
          {[{ y: 690, s: 1 }, { y: 560, s: .95 }, { y: 430, s: .9 }, { y: 300, s: .85 }, { y: 180, s: .8 }].map((m, i) => (
            <g key={i}>
              <g transform={`translate(200 ${m.y}) scale(${m.s})`}><motion.g><PaisleyDraw p={p} a={.06 + i * .04} b={.2 + i * .04} /></motion.g></g>
              <g transform={`translate(200 ${m.y}) scale(${-m.s} ${m.s})`}><PaisleyDraw p={p} a={.08 + i * .04} b={.22 + i * .04} /></g>
            </g>
          ))}
          {[640, 510, 380, 250].map((y, i) => <Dot key={y} x={200 + (i % 2 ? 22 : -22)} y={y} p={p} a={.2 + i * .02} />)}
        </svg>
        {c.mehendiLayers.filter((L) => L.z === 1).map((L, i) => <Layer key={`f${i}`} L={L} p={p} />)}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-[30%] bg-gradient-to-t from-[#0a1f24]/70 via-[#0a1f24]/25 to-transparent" />
        <motion.div className="legible absolute inset-x-0 bottom-[10%] z-10 px-6 text-center" style={{ opacity: mehO, y: mehY }}>
          <p className="text-xs font-semibold uppercase tracking-[.4em] text-[#f6dc96]">{mehendi.date}</p>
          <h3 className="mt-2 font-display text-4xl font-semibold uppercase tracking-[.28em] text-[#f6dc96] sm:text-5xl">{mehendi.name}</h3>
          <p className="mt-3 font-serif text-xl font-semibold italic text-[#fff6e0] sm:text-2xl">{mehendi.time} · {mehendi.venue}</p>
        </motion.div>
        <motion.div className="legible absolute inset-x-0 bottom-6 z-10 text-center text-xs font-semibold tracking-[.3em] text-white" style={{ opacity: hint }}>SCROLL</motion.div>

        {/* HALDI: turmeric splash grows from the bottom and reveals the painting */}
        <motion.div className="absolute z-20 overflow-hidden rounded-full will-change-transform" style={{ width: D, height: D, left: vp.w / 2 - D / 2, top: vp.h * 1.05 - D / 2, scale: irisS }}>
          <motion.div className="absolute will-change-transform" style={{ width: vp.w, height: vp.h, left: D / 2 - vp.w / 2, top: D / 2 - vp.h * 1.05, scale: irisInv, transformOrigin: `${vp.w / 2}px ${vp.h * 1.05}px` }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(80% 60% at 50% 100%, #ffd24a 0%, #f2a91c 55%, #d9830f 100%)" }} />
            <img src={haldi.art} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d0a17]/80 via-transparent to-[#3d0a17]/30" />
            <motion.div className="legible absolute inset-x-0 bottom-[12%] px-6 text-center" style={{ opacity: halO, y: halY }}>
              <p className="text-xs font-semibold uppercase tracking-[.4em] text-[#fff6d6]">{haldi.date}</p>
              <h3 className="mt-2 font-display text-4xl font-semibold uppercase tracking-[.28em] text-white sm:text-5xl">{haldi.name}</h3>
              <p className="mt-3 font-serif text-xl font-semibold italic text-white sm:text-2xl">{haldi.time} · {haldi.venue}</p>
            </motion.div>
          </motion.div>
        </motion.div>
        <Powder radius={splash} />
      </div>
    </section>
  );
}

function PaisleyDraw({ p, a, b }: { p: MotionValue<number>; a: number; b: number }) {
  const [outline, inner] = PAISLEY.split(" M");
  return (<><Stroke d={outline} p={p} a={a} b={b} w={2.2} /><Stroke d={"M" + inner} p={p} a={a + .02} b={b + .02} w={1.8} /></>);
}
