import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

/** Layered sacred fire. Every move is a function of scroll progress `p`; the fire lives in p = .90 → 1. */
type F = { src: string; x: number; w: number; a: number; b: number; sway: number; ph: number };
const FLAMES: F[] = [
  // back row: rises first, smaller
  { src: "flame-1", x: 12, w: 30, a: .90, b: .97, sway: 8, ph: 0 },
  { src: "flame-3", x: 34, w: 34, a: .905, b: .975, sway: 10, ph: 1.7 },
  { src: "flame-2", x: 62, w: 32, a: .91, b: .97, sway: 9, ph: 3.1 },
  { src: "flame-4", x: 88, w: 30, a: .9, b: .975, sway: 8, ph: 4.4 },
  // front row: bigger, later, sweeps past the top of the screen
  { src: "flame-3", x: 24, w: 52, a: .925, b: .99, sway: 14, ph: 2.2 },
  { src: "flame-1", x: 52, w: 60, a: .93, b: .995, sway: 16, ph: 5.1 },
  { src: "flame-4", x: 80, w: 52, a: .925, b: .99, sway: 14, ph: 3.7 },
];

function Flame({ f, p }: { f: F; p: MotionValue<number> }) {
  const y = useTransform(p, [f.a, f.b], ["115%", "-270%"]);
  const o = useTransform(p, [f.a, f.a + .01, f.b - .022, f.b], [0, 1, 1, 0]);
  const s = useTransform(p, [f.a, f.b], [.8, 1.5]);
  const x = useTransform(p, (v) => Math.sin(v * 520 + f.ph) * f.sway);
  const flick = useTransform(p, (v) => 1 + Math.sin(v * 1700 + f.ph) * .04);
  return (
    <div className="absolute bottom-0" style={{ left: `${f.x}%`, width: `min(${f.w}vw, ${f.w * 1.1}vh)`, transform: "translateX(-50%)" }}>
      <motion.img src={`/fire/${f.src}.webp`} alt="" draggable={false} className="block w-full origin-bottom" style={{ y, opacity: o, scale: s, x, scaleY: flick }} />
    </div>
  );
}

export default function SacredFire({ p }: { p: MotionValue<number> }) {
  const havanY = useTransform(p, [.9, .94], ["115%", "6%"]);
  const havanO = useTransform(p, [.9, .915, .965, .985], [0, 1, 1, 0]);
  const havanS = useTransform(p, [.9, .985], [.95, 1.12]);
  const sparkY = useTransform(p, [.92, .995], ["45%", "-90%"]);
  const sparkO = useTransform(p, [.92, .945, .97, .995], [0, 1, 1, 0]);
  return (
    <div className="pointer-events-none absolute inset-0 z-[31] overflow-hidden" aria-hidden="true">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "min(72vw, 76vh)" }}>
        <motion.img src="/fire/havan.webp" alt="" draggable={false} className="block w-full origin-bottom" style={{ y: havanY, opacity: havanO, scale: havanS }} />
      </div>
      {FLAMES.map((f, i) => <Flame key={i} f={f} p={p} />)}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: "min(110vw, 112vh)" }}>
        <motion.img src="/fire/sparks.webp" alt="" draggable={false} className="block w-full" style={{ y: sparkY, opacity: sparkO }} />
      </div>
    </div>
  );
}
