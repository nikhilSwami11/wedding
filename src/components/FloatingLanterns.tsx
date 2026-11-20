import type { CSSProperties } from "react";
import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

type L = { l: number; w: number; k: number; b: number; sway: number; blur: number; o: number };
const mk = (): L[] => {
  const out: L[] = [];
  const layers = [ { n: 4, w: [90, 130], blur: 5, o: .95, k: [1.3, 1.6] }, { n: 7, w: [44, 64], blur: 1, o: 1, k: [.8, 1.1] }, { n: 9, w: [20, 32], blur: 0, o: .85, k: [.45, .65] } ];
  let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  layers.forEach((ly) => { for (let i = 0; i < ly.n; i++) out.push({ l: r() * 100, w: ly.w[0] + r() * (ly.w[1] - ly.w[0]), k: ly.k[0] + r() * (ly.k[1] - ly.k[0]), b: r(), sway: 10 + r() * 30, blur: ly.blur, o: ly.o }); });
  return out;
};
const ALL = mk();

function Lantern({ x, p }: { x: L; p: MotionValue<number> }) {
  // position is a pure function of scroll: higher scroll → lantern rises (wraps around off-screen)
  const ty = useTransform(p, (v) => `${(((x.b - v * x.k) % 1) + 1) % 1 * 130 - 15}vh`);
  const dx = useTransform(p, (v) => Math.sin(v * 14 * x.k + x.b * 6) * x.sway);
  return <motion.span className="lt" style={{ left: `${x.l}%`, top: 0, y: ty, x: dx, "--w": `${x.w}px`, "--blur": `${x.blur}px`, "--o": x.o } as unknown as CSSProperties} />;
}

/** Lanterns whose position is driven only by scroll progress `p` (0 → 1). */
export default function FloatingLanterns({ p, density = 1, className = "" }: { p: MotionValue<number>; density?: number; className?: string }) {
  const list = ALL.slice(0, Math.ceil(ALL.length * density));
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {list.map((x, i) => <Lantern key={i} x={x} p={p} />)}
    </div>
  );
}
