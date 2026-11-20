import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { content as c } from "../content";
import { Embers } from "../components/Decor";
import SacredFire from "../components/SacredFire";

import { CASTLE, DOOR_L, DOOR_R, CW as W, CH as H, CX, TOP, BOT, LEFT, RIGHT, ARCH, LEAF_L, LEAF_R, MID_Y } from "../components/CastleBackdrop";

const VARMALA = "/art/varmala.webp";
const FIRE = "/art/fire.webp";

/** Where the couple stands inside the doorway, as a share of the doorway height. The full-screen scene reuses it, so the couple never jumps. */
const CP = { h: .7, bottom: .93 };

/**
 * Scene: the whole castle → push in to the gate → the two doors swing open → the bride and groom inside,
 * held for a long scroll → the sacred fire. Every motion is a function of scroll position.
 */
export default function GateScene({ p }: { p: MotionValue<number> }) {
  const frame = useRef<HTMLDivElement>(null);
  const leafL = useRef<SVGGElement>(null);
  const leafR = useRef<SVGGElement>(null);
  const [origin, setOrigin] = useState("50% 68%");
  const [wide, setWide] = useState(false);
  const zEnd = useMotionValue(6);
  const shift = useMotionValue(0); // px the doorway must travel to reach the screen centre
  const hasInterior = !!(c.couple.png && c.couple.bgTall); // needs the empty castle-interior background too
  const [rect, setRect] = useState({ Rh: 0, H: 0 }); // on-screen height of the doorway at the end of the zoom

  // Portrait screens show the whole castle. Wide screens show the full-width gateway band (bottom-aligned), so the castle fills the width.
  useEffect(() => {
    const f = () => {
      const el = frame.current; if (!el) return;
      const w = el.clientWidth, h = el.clientHeight, isWide = w / h > 0.8;
      const vx = 0, vy = isWide ? 600 : 0, vw = W, vh = isWide ? 1560 : H;
      const s = Math.max(w / vw, h / vh);
      const ox = (w - vw * s) / 2, oy = isWide ? h - vh * s : (h - vh * s) / 2;
      setWide(isWide);
      shift.set(h / 2 - (oy + (MID_Y - vy) * s));
      setOrigin(`${ox + (CX - vx) * s}px ${oy + (MID_Y - vy) * s}px`);
      const ze = isWide ? h / ((BOT - TOP) * s) : 1.06 * Math.max(w / ((RIGHT - LEFT) * s), h / ((BOT - TOP) * s));
      zEnd.set(ze);
      setRect({ Rh: (BOT - TOP) * s * ze, H: h });
    };
    f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, [zEnd, shift]);

  const open = useTransform(p, [.3, .46], [1, 0.03]); // door width factor
  const setLeaf = (v: number) => {
    leafL.current?.setAttribute("transform", `translate(${LEFT} 0) scale(${v} 1) translate(${-LEFT} 0)`);
    leafR.current?.setAttribute("transform", `translate(${RIGHT} 0) scale(${v} 1) translate(${-RIGHT} 0)`);
  };
  useEffect(() => setLeaf(open.get()));
  useMotionValueEvent(open, "change", setLeaf);

  const title = useTransform(p, [.02, .07, .22, .3], [0, 1, 1, 0]);
  const hint = useTransform(p, [.02, .07, .22, .3], [0, 1, 1, 0]);
  // zoom grows geometrically up to zEnd, so it works for both the small wide-screen target and the big phone one
  const zoom1 = useTransform([p, zEnd], ([v, ze]: number[]) => {
    const k = [[.08, 0], [.3, .44], [.46, .64], [.58, 1]];
    let t = 0;
    if (v >= k[k.length - 1][0]) t = 1;
    else if (v > k[0][0]) for (let i = 1; i < k.length; i++) if (v <= k[i][0]) { const [a0, t0] = k[i - 1], [a1, t1] = k[i]; t = t0 + ((v - a0) / (a1 - a0)) * (t1 - t0); break; }
    return Math.pow(Math.max(ze, 1), t);
  });
  const ty = useTransform([zoom1, zEnd, shift], ([z, ze, sh]: number[]) => sh * Math.min(1, Math.max(0, (z - 1) / (ze - 1))));
  const glow = useTransform(p, [.3, .42, .56], [0, .5, 0]); // a brief glow as the doors part, gone before you read the couple
  const castleO = useTransform(p, hasInterior ? [.6, .68] : [0, 1], hasInterior ? [1, 0] : [1, 1]);
  // the couple: a full screen of their own, held for a long scroll (.52 → .9)
  const coupleO = useTransform(p, [.6, .68], [0, 1]); // starts only after the zoom has stopped, so nothing is moving while it blends
  // once inside, the camera keeps pushing in and drifts down the room; the couple stays put in front (depth), only gently growing
  const walk = useTransform(p, [.62, .9], [0, 1]);
  const bgS = useTransform(walk, (t) => 1.08 + .32 * t);
  const bgPos = useTransform(walk, (t) => `50% ${12 + 58 * t}%`); // on wide screens the picture is taller than the screen: drift down it
  const bgY = useTransform(walk, (t) => `${-(.32 * t) * 100 * t * .9}%`);
  const coupleS = useTransform(walk, [0, 1], [1, 1.07]);
  const names = useTransform(p, [.6, .65, .78, .82], [0, 1, 1, 0]);
  const cap1 = useTransform(p, [.66, .7, .78, .82], [0, 1, 1, 0]);
  const cap2 = useTransform(p, [.8, .83, .9, .93], [0, 1, 1, 0]);
  // the sacred fire: blazing flames rise over the scene (bright, but the couple stays readable underneath), then it settles to dark
  const fireO = useTransform(p, [.9, .94], [0, .55]); // the old full-screen blaze stays underneath, dimmer, for the brightness
  const fireY = useTransform(p, [.9, .99], ["60%", "-4%"]);
  const fireS = useTransform(p, [.9, .99], [.8, 1.3]);
  const flick = useTransform(p, (v) => 1 + Math.sin(v * 1400) * .025); // scroll-driven flicker
  const burnDim = useTransform(p, [.9, .97], [0, .4]);
  const glow2 = useTransform(p, [.94, .975, 1], [0, .5, 0]);
  const emberQ = useTransform(p, [.89, 1], [0, 1]);

  return (
    <div ref={frame} className="relative h-screen w-screen overflow-hidden">
          {/* the castle: the doorway shows the varmala; two leaves cover it and swing open */}
          <motion.svg viewBox={wide ? `0 600 ${W} 1560` : `0 0 ${W} ${H}`} preserveAspectRatio={wide ? "xMidYMax slice" : "xMidYMid slice"} className="absolute inset-0 h-full w-full" style={{ y: ty, scale: zoom1, transformOrigin: origin }} aria-hidden="true">
            <defs>
              <clipPath id="arch"><path d={ARCH} /></clipPath>
              <clipPath id="leafL"><path d={LEAF_L} /></clipPath>
              <clipPath id="leafR"><path d={LEAF_R} /></clipPath>
              <mask id="hole" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                <rect width={W} height={H} fill="#fff" />
                <path d={ARCH} fill="#000" />
              </mask>
              <radialGradient id="spill" cx="50%" cy="60%" r="65%"><stop offset="0" stopColor="#ffe6a8" /><stop offset="1" stopColor="#ff9a2e" stopOpacity="0" /></radialGradient>
            </defs>
            {hasInterior ? (
              <>
                <image href={c.couple.bgTall} x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOT - TOP} preserveAspectRatio="xMidYMid slice" />
                <image href={c.couple.png} x={LEFT} y={TOP + (CP.bottom - CP.h) * (BOT - TOP)} width={RIGHT - LEFT} height={CP.h * (BOT - TOP)} preserveAspectRatio="xMidYMax meet" />
              </>
            ) : (
              <image href={VARMALA} x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOT - TOP} preserveAspectRatio="xMidYMid slice" />
            )}
            <motion.rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={BOT - TOP} fill="url(#spill)" clipPath="url(#arch)" style={{ opacity: glow }} />
            <motion.g style={{ opacity: castleO }}>
              <image href={CASTLE} width={W} height={H} mask="url(#hole)" preserveAspectRatio="none" />
              <g ref={leafL}><g clipPath="url(#leafL)"><path d={LEAF_L} fill="#2e1b10" /><image href={DOOR_L} x={LEFT} y={TOP} width={CX - LEFT} height={BOT - TOP} preserveAspectRatio="none" /></g></g>
              <g ref={leafR}><g clipPath="url(#leafR)"><path d={LEAF_R} fill="#2e1b10" /><image href={DOOR_R} x={CX} y={TOP} width={RIGHT - CX} height={BOT - TOP} preserveAspectRatio="none" /></g></g>
            </motion.g>
          </motion.svg>

          {/* the couple screen: the castle interior fills the screen; the couple stands exactly where they stood in the doorway */}
          {hasInterior && rect.Rh > 0 && (
            <motion.div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" style={{ opacity: coupleO }}>
              <motion.div className="absolute inset-0 origin-top" style={{ scale: bgS, y: bgY }}>
                <picture>
                  {c.couple.bgWide && <source media="(min-aspect-ratio: 1/1)" srcSet={c.couple.bgWide} />}
                  <motion.img src={c.couple.bgTall} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: bgPos }} />
                </picture>
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-[24%]" style={{ backgroundImage: "url(/art/floor.webp)", backgroundSize: "cover", backgroundPosition: "center bottom", filter: "brightness(.82) saturate(.9)", WebkitMaskImage: "linear-gradient(to top, #000 50%, transparent)", maskImage: "linear-gradient(to top, #000 50%, transparent)" }} />
              <motion.div className="absolute inset-0" style={{ scale: coupleS, transformOrigin: "50% 100%" }}>
                <img src={c.couple.png} alt={`${c.bride} and ${c.groom}`} className="absolute left-1/2 max-w-none -translate-x-1/2"
                  style={{ height: rect.Rh * CP.h, bottom: rect.H / 2 - rect.Rh * (CP.bottom - .5) }} />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-[26%] bg-gradient-to-t from-[#2a0a14]/65 to-transparent" />
            </motion.div>
          )}
          <motion.div className="pointer-events-none absolute inset-x-0 top-[6%] z-20 px-6 text-center" style={{ opacity: names }}>
            <p className="font-display text-xs font-semibold uppercase tracking-[.4em] text-[#fff6e0] legible">The wedding of</p>
            <p className="mt-2 font-serif text-5xl font-semibold text-white legible">{c.bride} <span className="text-[#f1d596]">&amp;</span> {c.groom}</p>
          </motion.div>

          <motion.div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[#1f050d]/70 to-transparent px-6 pb-16 pt-[7%] text-center" style={{ opacity: title }}>
            <p className="text-xs font-semibold uppercase tracking-[.4em] text-[#fff6e0] legible">Step inside</p>
            <p className="mt-3 font-serif text-4xl font-semibold text-white legible">{c.bride} <span className="text-[#f1d596]">&amp;</span> {c.groom}</p>
          </motion.div>
          <motion.div className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-1 text-xs font-semibold tracking-[.3em] text-white legible" style={{ opacity: hint }}>
            <span>SCROLL TO ENTER</span><span className="h-7 w-px bg-white/70" />
          </motion.div>

          <motion.div className="absolute inset-x-0 bottom-[12%] z-20 px-6 text-center" style={{ opacity: cap1 }}>
            <p className="text-xs font-semibold uppercase tracking-[.4em] text-[#fff6e0]">The Varmala</p>
            <p className="mt-3 font-serif text-3xl font-semibold italic leading-snug text-white legible">Two hearts, one garland</p>
          </motion.div>
          <motion.div className="absolute inset-x-0 bottom-[12%] z-20 px-6 text-center" style={{ opacity: cap2 }}>
            <p className="text-xs font-semibold uppercase tracking-[.4em] text-[#fff6e0]">{c.dateLabel}</p>
            <p className="mt-3 font-serif text-3xl font-semibold italic leading-snug text-white legible">Before the sacred fire</p>
          </motion.div>

          <motion.div className="pointer-events-none absolute inset-0 z-[25] bg-[#1f050d]" style={{ opacity: burnDim }} />
          <motion.div className="pointer-events-none absolute inset-0 z-30 overflow-hidden mix-blend-screen" style={{ opacity: fireO }}>
            <motion.div className="absolute inset-x-0 bottom-0 h-full origin-bottom" style={{ y: fireY, scale: fireS }}>
              <motion.img src={FIRE} alt="" className="h-full w-full origin-bottom object-cover" style={{ scaleY: flick }} />
            </motion.div>
          </motion.div>
          <SacredFire p={p} />
          <Embers q={emberQ} className="z-[31]" />
          <motion.div className="pointer-events-none absolute inset-0 z-[32]" style={{ opacity: glow2, background: "radial-gradient(90% 70% at 50% 85%, #ffd27a 0%, #ff8a1c 50%, rgba(61,10,23,0) 100%)" }} />
    </div>
  );
}
