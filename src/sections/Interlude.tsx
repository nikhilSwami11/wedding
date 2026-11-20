import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** A calm one-page pause between the Feast and the Mehendi: one quiet line, held centred while the painting drifts by. */
export default function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const o = useTransform(p, [.02, .2, .8, .98], [0, 1, 1, 0]);
  const y = useTransform(p, [.02, .2, .8, .98], ["30px", "0px", "0px", "-30px"]);
  return (
    <section ref={ref} className="relative h-[190vh]" aria-label="The festivities">
      <div className="sticky top-0 grid h-screen place-items-center overflow-hidden px-6">
        <motion.div style={{ opacity: o, y }} className="soft-shadow relative text-center">
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-12 -z-10" style={{ background: "radial-gradient(closest-side, rgba(14,5,10,.55), rgba(14,5,10,.25) 60%, transparent)" }} />
          <p className="font-display text-xs uppercase tracking-[.42em] text-[#f6dc96]">The festivities</p>
          <p className="mx-auto mt-4 max-w-sm font-serif text-3xl italic leading-snug text-[#fbf5e6] sm:text-4xl">Five celebrations of colour, music and blessings</p>
          <div className="mx-auto mt-6 h-px w-16 bg-[#f1d596]/80" />
        </motion.div>
      </div>
    </section>
  );
}
