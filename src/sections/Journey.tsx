import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PanoFrame } from "./PanoHero";
import GateScene from "./VarmalaDoors";

/**
 * Hero → castle → gate → couple → fire, as ONE scene with ONE pinned stage.
 * Part 1 pans the painted fort and fades the castle in (the castle is the same picture the gate then zooms into).
 * Part 2 zooms into the gate, opens it, and so on. There is no hand-off between two scroll scenes, so nothing can flicker.
 */
const PAN = 260, GATE = 800; // scroll lengths in screen heights

export default function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const f = PAN / (PAN + GATE);
  const pPan = useTransform(p, [0, f], [0, 1], { clamp: true });
  const pGate = useTransform(p, [f, 1], [0, 1], { clamp: true });
  const castleIn = useTransform(pPan, [.78, .97], [0, 1]); // the castle dissolves in over the zooming fort
  const stageOut = useTransform(pGate, [.96, 1], [1, 0]); // at the very end everything dissolves into the night sky behind
  return (
    <section ref={ref} className="relative z-10" style={{ height: `${PAN + GATE + 100}vh` }} aria-label="The palace and the gate">
      <motion.div className="sticky top-0 h-screen overflow-hidden bg-[#2a0a14]" style={{ opacity: stageOut }}>
        <PanoFrame p={pPan} />
        <motion.div className="absolute inset-0 z-[15]" style={{ opacity: castleIn }}><GateScene p={pGate} /></motion.div>
      </motion.div>
    </section>
  );
}
