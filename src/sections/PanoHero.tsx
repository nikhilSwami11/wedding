import { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { content as c } from "../content";
import FloatingLanterns from "../components/FloatingLanterns";
import Countdown from "../components/Countdown";

/**
 * One tall castle painting (sky on top, fort below). The stage is a single viewport; the painting is
 * 2.2 viewports tall and is panned upward as `p` goes 0 → 1, so the sky is seen first and the castle
 * is revealed from the bottom. Swap SKY / CASTLE for your own tall image (or set CASTLE only).
 */
const SKY = "/art/hero-sky.webp";
const CASTLE = "/art/hero-far.webp";

const ASPECT = 2087 / 1400; // castle painting height / width

/** Track = castle painting at full width (never cropped) with sky extended above it when the screen is tall. */
function useTrack() {
  const [r, setR] = useState(54);
  useEffect(() => {
    const f = () => {
      const w = window.innerWidth, vh = window.innerHeight;
      const castleH = w * ASPECT;
      const trackH = Math.max(castleH, vh * 1.7);
      setR(((trackH - vh) / trackH) * 100);
    };
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return r;
}

export function PanoFrame({ p }: { p: MotionValue<number> }) {
  const r = useTrack();
  const timerO = useTransform(p, [.5, .6, .9, .97], [0, 1, 1, 0]); // held for about a page of scroll, through the castle dissolve
  const enter = useTransform(p, [.84, 1], [1, 2.4]);
  const timerY = useTransform(p, [.5, .62], ["24px", "0px"]);
  const y = useTransform(p, [0, 1], ["0%", `-${r}%`]);
  const titleO = useTransform(p, [.1, .46], [1, 0]);
  const titleY = useTransform(p, [.1, .46], ["0%", "-26%"]);
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#2a0a14]">
      <motion.div className="absolute inset-0 origin-[76%_80%]" style={{ scale: enter }}>
      <motion.div className="absolute inset-x-0 top-0" style={{ y, height: "max(149.1vw, 170vh)" }}>
        <div className="absolute inset-0 bg-cover bg-top" style={{ backgroundImage: `url(${SKY})` }} />
        <div className="absolute inset-x-0 bottom-0 bg-cover bg-top" style={{ backgroundImage: `url(${CASTLE})`, height: "149.1vw" }} />
      </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[6] h-44 bg-gradient-to-b from-[#1f050d] to-transparent" />
      <FloatingLanterns p={p} density={0.8} />
      <motion.div className="absolute inset-x-0 top-[17%] z-10 flex flex-col items-center px-6 text-center text-[#fbf5e6] soft-shadow" style={{ opacity: titleO, y: titleY }}>
        <p className="font-serif text-base italic tracking-[.18em] text-white/90 sm:text-lg">The wedding of</p>
        <h1 className="title-caps mt-6 flex font-normal flex-col items-center text-[2.9rem] leading-none sm:text-7xl">
          <span>{c.bride}</span>
          <span className="my-5 flex items-center gap-4 font-serif text-xl font-normal italic normal-case tracking-[.3em] text-white/85 sm:text-2xl"><i className="h-px w-10 bg-white/60" />weds<i className="h-px w-10 bg-white/60" /></span>
          <span>{c.groom}</span>
        </h1>
        <div className="mt-9 h-px w-20 bg-[#f1d596]/80" />
        <p className="mt-6 font-serif text-xl italic">{c.dateLabel}</p>
        <p className="mt-2 text-xs uppercase tracking-[.4em] text-white/85">{c.city}</p>
      </motion.div>
      <motion.div className="absolute inset-x-0 top-[20%] z-[16]" style={{ opacity: timerO, y: timerY }}><Countdown /></motion.div>
      <motion.div className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1 text-[11px] tracking-[.3em] text-white/85 soft-shadow" style={{ opacity: titleO }}>
        <span>SCROLL</span><span className="h-7 w-px bg-white/70" />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-32 bg-gradient-to-b from-transparent to-[#3d0a17]" />
    </div>
  );
}
