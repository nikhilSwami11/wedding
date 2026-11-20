import { useState } from "react";
import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

type Pt = { x: number; s: number; b: number; k: number; sway: number; blur: number };
const mk = (n: number, seed: number): Pt[] => {
  let s = seed * 7919; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: n }, (_, i) => {
    const near = i % 5 === 0;
    return { x: r() * 100, s: near ? 26 + r() * 18 : 10 + r() * 14, b: r(), k: near ? 1.5 + r() * .6 : .6 + r() * .6, sway: 14 + r() * 36, blur: near ? 1 : 0 };
  });
};

function Ember({ d, q }: { d: Pt; q: MotionValue<number> }) {
  const y = useTransform(q, (v) => `${110 - ((((d.b + v * d.k * 1.6) % 1) + 1) % 1) * 125}vh`); // transform, not `top`: no layout per frame
  const x = useTransform(q, (v) => Math.sin(v * 9 * d.k + d.b * 6) * d.sway * .6);
  const o = useTransform(q, [0, .15, .85, 1], [0, 1, 1, 0]);
  return <motion.i className="absolute block rounded-full will-change-transform" style={{ left: `${d.x}%`, top: 0, y, x, opacity: o, width: d.s * .28, height: d.s * .28, background: "radial-gradient(circle, #fff3b0 0%, #ffb21e 45%, rgba(255,106,0,0) 72%)" }} />;
}

/** Glowing sparks that rise while `q` (0 → 1) runs. Pure function of scroll. */
export function Embers({ q, count = 36, className = "" }: { q: MotionValue<number>; count?: number; className?: string }) {
  const [list] = useState(() => mk(count, 11));
  return <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">{list.map((d, i) => <Ember key={i} d={d} q={q} />)}</div>;
}
