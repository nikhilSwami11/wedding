import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/** One continuous painting (sky → palace → garden → lake → diyas) that sits behind the whole page and descends as you scroll. */
const SRC = "/bg/palace.webp";
const SRC_SMALL = "/bg/palace-m.webp"; // 768px wide copy for phones: a quarter of the pixels to decode
const NW = 1536, NH = 9280;
/** Which spot of the painting is at the TOP of the screen when each section's top reaches the top of the screen. */
const STOPS: [string, number][] = [["Save the date", 0], ["The Feast", 650], ["Mehendi and Haldi", 4300], ["Venue", 6700]];

export default function PageBackdrop({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [dim, setDim] = useState({ s: 1, vh: 900 });
  const marks = useRef<{ at: number[]; img: number[] }>({ at: [0], img: [0] });

  useEffect(() => {
    const measure = () => {
      const w = wrap.current; if (!w) return;
      const vw = window.innerWidth, vh = window.innerHeight;
      const s = Math.max(vw / NW, (6 * vh) / NH); // on tall phone screens the painting is shown larger, cropped at the sides
      const maxTop = NH - vh / s;
      const top = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
      const at: number[] = [], img: number[] = [];
      for (const [label, y] of STOPS) {
        const el = w.querySelector(`[aria-label="${label}"]`); if (!el) continue;
        at.push(top(el)); img.push(Math.min(y, maxTop));
      }
      at.push(top(w) + w.offsetHeight - vh); img.push(maxTop); // the very bottom of the page shows the very bottom of the painting
      marks.current = { at, img };
      setDim({ s, vh });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("load", measure); };
  }, []);

  const y = useTransform(scrollY, (v) => {
    const { at, img } = marks.current;
    let top = img[0];
    if (v >= at[at.length - 1]) top = img[img.length - 1];
    else if (v > at[0]) for (let i = 1; i < at.length; i++) if (v <= at[i]) { top = img[i - 1] + ((v - at[i - 1]) / (at[i] - at[i - 1])) * (img[i] - img[i - 1]); break; }
    return -top * dim.s;
  });

  return (
    <div ref={wrap} className="relative -mt-[100vh]">
      {/* the painting is pinned behind the page for as long as the page lasts */}
      <div className="pointer-events-none sticky top-0 z-0 -mb-[100vh] h-screen overflow-hidden bg-[#10161f]" aria-hidden="true">
        <motion.img src={window.innerWidth < 700 ? SRC_SMALL : SRC} alt="" draggable={false} decoding="async" className="absolute left-1/2 top-0 max-w-none select-none will-change-transform" style={{ width: NW * dim.s, height: NH * dim.s, x: "-50%", y }} />
        <div className="absolute inset-0 bg-[#1f050d]/15" />
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
