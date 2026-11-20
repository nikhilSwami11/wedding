import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";

type Dish = { src: string; name: string; from: "Punjab" | "Rajasthan"; side: -1 | 1; w: number; ar: number; x: number; y: number; rot: number; a: number };

/**
 * Where each dish finally rests, in % of the (square) thali, measured from its centre. `ar` is the image's width/height so
 * every dish is centred exactly on its spot. Spots are chosen so the dishes sit INSIDE the rim with even gaps:
 * Punjab on the left half, Rajasthan on the right, the centre of the plate left clear.
 */
const DISHES: Dish[] = [
  { src: "/art/food-saag-makki.webp", name: "Sarson da Saag & Makki di Roti", from: "Punjab", side: -1, w: 37, ar: 1.94, x: -14, y: -24, rot: -6, a: .06 },
  { src: "/art/food-lassi.webp", name: "Lassi", from: "Punjab", side: -1, w: 15, ar: .69, x: -33, y: 1, rot: -4, a: .2 },
  { src: "/art/food-jalebi.webp", name: "Jalebi", from: "Punjab", side: -1, w: 25, ar: 1.08, x: -20, y: 25, rot: -8, a: .34 },
  { src: "/art/food-dal-baati.webp", name: "Dal Baati Churma", from: "Rajasthan", side: 1, w: 37, ar: 1.47, x: 15, y: 25, rot: 4, a: .5 },
  { src: "/art/food-ghewar.webp", name: "Ghewar", from: "Rajasthan", side: 1, w: 31, ar: 1.16, x: 24, y: -14, rot: 8, a: .64 },
];

function Item({ d, p }: { d: Dish; p: MotionValue<number> }) {
  const a = d.a, b = d.a + .18;
  const x = useTransform(p, [a, b], [`${d.side * 140}vw`, "0vw"]);
  const o = useTransform(p, [a, a + .06], [0, 1]);
  const rot = useTransform(p, [a, b, 1], [d.side * 40, d.rot, d.rot]);
  const s = useTransform(p, [a, b], [1.25, 1]);
  const lift = useTransform(p, [.92, .99], ["0vh", "-120vh"]);
  // the outer box pins the dish's centre; the inner one carries the fly-in so the final spot never drifts
  return (
    <div className="absolute" style={{ left: `${50 + d.x - d.w / 2}%`, top: `${50 + d.y - d.w / d.ar / 2}%`, width: `${d.w}%` }}>
      <motion.div style={{ x, opacity: o, rotate: rot, scale: s, y: lift }}>
        <img src={d.src} alt={d.name} className="block w-full" />
      </motion.div>
    </div>
  );
}

/** Scene: "The Feast". An empty brass thali; Punjabi and Rajasthani dishes fly in from either side as you scroll. */
export default function FeastScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const head = useTransform(p, [0, .08, .86, .92], [0, 1, 1, 0]);
  const spin = useTransform(p, [0, 1], [-14, 20]);
  const plateS = useTransform(p, [0, .25], [.82, 1]);
  const plateY = useTransform(p, [.92, .99], ["0vh", "-120vh"]);
  const cap = [
    { r: [.12, .18, .3, .35], t: "Punjab", n: DISHES[0].name },
    { r: [.26, .32, .4, .45], t: "Punjab", n: DISHES[1].name },
    { r: [.4, .46, .52, .57], t: "Punjab", n: DISHES[2].name },
    { r: [.56, .62, .68, .73], t: "Rajasthan", n: DISHES[3].name },
    { r: [.7, .76, .88, .93], t: "Rajasthan", n: DISHES[4].name },
  ];
  return (
    <section ref={ref} className="relative h-[480vh]" aria-label="The Feast">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 50%, rgba(31,5,13,.55), rgba(31,5,13,.1) 70%, transparent)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[24%] bg-gradient-to-b from-[#120508]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[30%] bg-gradient-to-t from-[#120508]/80 to-transparent" />
        <motion.div className="legible absolute inset-x-0 top-[5%] z-20 px-6 text-center" style={{ opacity: head }}>
          <p className="title-caps text-xs font-semibold tracking-[.4em] text-[#f6dc96]">Punjab meets Rajasthan</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#fff6e0] sm:text-5xl">The Feast</h2>
        </motion.div>

        <div className="absolute left-1/2 top-[50%] aspect-square w-[min(92vw,60svh,640px)] -translate-x-1/2 -translate-y-1/2">
          <motion.div className="h-full w-full will-change-transform" style={{ scale: plateS, y: plateY }}>
            <div className="absolute inset-[3%] rounded-full shadow-[0_30px_50px_rgba(0,0,0,.55)]" />
            <motion.div className="h-full w-full will-change-transform" style={{ rotate: spin }}>
              <img src="/art/food-thali.webp" alt="" className="h-full w-full object-contain" />
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute left-1/2 top-[50%] z-10 aspect-square w-[min(92vw,60svh,640px)] -translate-x-1/2 -translate-y-1/2">
          {DISHES.map((d) => <Item key={d.name} d={d} p={p} />)}
        </div>

        {cap.map((c, i) => <Caption key={c.n} p={p} range={c.r} tag={c.t} name={c.n} i={i} />)}
      </div>
    </section>
  );
}

function Caption({ p, range, tag, name }: { p: MotionValue<number>; range: number[]; tag: string; name: string; i: number }) {
  const o = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, [range[0], range[1]], ["14px", "0px"]);
  return (
    <motion.div className="legible pointer-events-none absolute inset-x-0 bottom-[4%] z-20 px-6 text-center" style={{ opacity: o, y }}>
      <p className="text-xs font-semibold uppercase tracking-[.4em] text-[#f6dc96]">{tag}</p>
      <p className="mt-2 font-serif text-3xl font-semibold italic text-[#fff6e0] sm:text-4xl">{name}</p>
    </motion.div>
  );
}
