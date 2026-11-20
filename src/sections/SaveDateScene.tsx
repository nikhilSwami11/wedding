import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as RPointerEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import FloatingLanterns from "../components/FloatingLanterns";
import { Embers } from "../components/Decor";
import { content as c } from "../content";

const LATTICE = "/art/lattice.webp";
const FLORAL = "/art/floral.webp";
const REVEAL_AT = 0.5;

/** Painted gold leaf: warm gradient, brush streaks, the Mughal lattice pressed into it, and a small plaque. */
function paintFoil(ctx: CanvasRenderingContext2D, w: number, h: number, lattice: HTMLImageElement | null) {
  let s = 11; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const g = ctx.createLinearGradient(0, 0, w, h);
  [[0, "#a8741f"], [.22, "#f3d684"], [.45, "#cf9833"], [.7, "#fbe9ae"], [1, "#96651a"]].forEach(([o, col]) => g.addColorStop(o as number, col as string));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (lattice) {
    ctx.save(); ctx.globalCompositeOperation = "soft-light"; ctx.globalAlpha = .95;
    const k = Math.max(w / lattice.width, h / lattice.height) * 1.1;
    ctx.drawImage(lattice, (w - lattice.width * k) / 2, (h - lattice.height * k) / 2, lattice.width * k, lattice.height * k);
    ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = .22;
    ctx.drawImage(lattice, (w - lattice.width * k) / 2, (h - lattice.height * k) / 2, lattice.width * k, lattice.height * k);
    ctx.restore();
  }
  ctx.lineCap = "round";
  for (let i = 0; i < 70; i++) {
    const y = r() * h, x = r() * w - 40;
    ctx.strokeStyle = r() > .5 ? `rgba(255,248,214,${.05 + r() * .12})` : `rgba(110,66,10,${.04 + r() * .09})`;
    ctx.lineWidth = 1 + r() * 6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x + 40, y - 6 + r() * 12, x + 90, y - 6 + r() * 12, x + 80 + r() * 120, y + (r() - .5) * 14); ctx.stroke();
  }
  // glints
  for (let i = 0; i < 140; i++) { ctx.fillStyle = `rgba(255,250,225,${r() * .5})`; ctx.fillRect(r() * w, r() * h, 1.2, 1.2); }
  // plaque
  const fs = Math.min(w * .085, 30), label = "Scratch to reveal";
  ctx.font = `600 ${fs}px "Cormorant Garamond", Georgia, serif`;
  const pw = ctx.measureText(label).width + fs * 2.2, ph = fs * 2.1, cx = w / 2, cy = h * .56;
  ctx.fillStyle = "rgba(78,12,28,.94)";
  ctx.beginPath(); ctx.roundRect(cx - pw / 2, cy - ph / 2, pw, ph, ph / 2); ctx.fill();
  ctx.strokeStyle = "#f6dc96"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(cx - pw / 2 + 5, cy - ph / 2 + 5, pw - 10, ph - 10, (ph - 10) / 2); ctx.stroke();
  ctx.fillStyle = "#f6dc96"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy + fs * .05);
}

function clearedShare(cv: HTMLCanvasElement) {
  const ctx = cv.getContext("2d"); if (!ctx) return 0;
  const { width, height } = cv, d = ctx.getImageData(0, 0, width, height).data, st = 8;
  let clear = 0, tot = 0;
  for (let y = 0; y < height; y += st) for (let x = 0; x < width; x += st) { tot++; if (d[(y * width + x) * 4 + 3] < 40) clear++; }
  return tot ? clear / tot : 0;
}

const DAY = new Date(c.dateISO);
const calUrl = (() => {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const end = new Date(DAY.getTime() + 5 * 3600e3);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${c.bride} & ${c.groom}'s Wedding`)}&dates=${f(DAY)}/${f(end)}&location=${encodeURIComponent(c.city)}`;
})();

function Card() {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement | null>(null);
  const st = useRef({ down: false, x: 0, y: 0, touched: false, last: 0 });

  useEffect(() => { if (reduce) setRevealed(true); }, [reduce]);

  const paint = useCallback(() => {
    const el = cv.current, b = box.current; if (!el || !b || st.current.touched) return;
    const { width, height } = b.getBoundingClientRect(); if (!width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    el.width = Math.round(width * dpr); el.height = Math.round(height * dpr);
    const ctx = el.getContext("2d"); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFoil(ctx, width, height, img.current);
  }, []);

  useEffect(() => {
    if (revealed) return;
    const im = new Image(); im.src = LATTICE; im.onload = () => { img.current = im; paint(); };
    paint(); document.fonts?.ready.then(paint).catch(() => undefined);
    addEventListener("resize", paint); return () => removeEventListener("resize", paint);
  }, [paint, revealed]);

  const scratch = (e: RPointerEvent<HTMLCanvasElement>, start: boolean) => {
    const el = cv.current, ctx = el?.getContext("2d"); if (!el || !ctx) return;
    const b = el.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top, s = st.current;
    const from = start ? { x, y } : { x: s.x, y: s.y };
    ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = e.pointerType === "mouse" ? 46 : 58;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(x + .01, y + .01); ctx.stroke();
    s.x = x; s.y = y; s.touched = true;
  };
  const check = (force: boolean) => {
    const n = performance.now(); if (!force && n - st.current.last < 240) return; st.current.last = n;
    if (cv.current && clearedShare(cv.current) >= REVEAL_AT) setRevealed(true);
  };

  const wd = DAY.toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" });
  const mo = DAY.toLocaleDateString("en-IN", { month: "long", timeZone: "Asia/Kolkata" });
  const dd = DAY.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" });
  const yr = DAY.toLocaleDateString("en-IN", { year: "numeric", timeZone: "Asia/Kolkata" });

  return (
    <div className="flex flex-col items-center">
      {/* gold frame → arch window */}
      <div className="relative w-[min(84vw,360px)] rounded-t-[999px] rounded-b-[28px] p-[7px] shadow-[0_30px_60px_rgba(0,0,0,.5)]" style={{ background: "linear-gradient(160deg,#f6dc96,#b9852a 45%,#f1d596 70%,#a8741f)" }}>
        <div ref={box} className="relative aspect-[4/5.4] overflow-hidden rounded-t-[999px] rounded-b-[22px] bg-[#fbeee0]">
          {/* what lies beneath */}
          <img src={FLORAL} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fbeee0]/10 via-[#fbeee0]/55 to-[#fbeee0]/85" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-10 text-center text-[#5e1224]">
            <p className="font-display text-[11px] tracking-[.42em]">SAVE THE DATE</p>
            <div className="my-3 flex items-center gap-3 text-[#b9852a]"><i className="h-px w-10 bg-current" /><span className="text-xs">✦</span><i className="h-px w-10 bg-current" /></div>
            <p className="font-serif text-lg italic">{wd}</p>
            <p className="font-serif text-[6.2rem] font-medium leading-[.95] text-[#7a1830] mb-2 [font-variant-numeric:lining-nums]">{dd}</p>
            <p className="font-display text-sm uppercase tracking-[.38em]">{mo} {yr}</p>
            <div className="my-4 h-px w-16 bg-[#b9852a]/70" />
            <p className="font-serif text-[1.65rem] leading-tight">{c.bride} <span className="text-[#b9852a]">&amp;</span> {c.groom}</p>
            <p className="mt-2 text-[10px] uppercase tracking-[.32em] text-[#5e1224]/75">{c.city}</p>
          </div>
          <canvas ref={cv} aria-hidden="true" className="absolute inset-0 h-full w-full cursor-grab touch-none transition-[opacity,transform] duration-1000 ease-out active:cursor-grabbing"
            style={revealed ? { opacity: 0, transform: "scale(1.04)", pointerEvents: "none" } : undefined}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); st.current.down = true; scratch(e, true); }}
            onPointerMove={(e) => { if (!st.current.down) return; scratch(e, false); check(false); }}
            onPointerUp={() => { st.current.down = false; check(true); }}
            onPointerCancel={() => { st.current.down = false; }} />
        </div>
      </div>
      <p className="legible mt-7 min-h-[1.75rem] font-serif text-xl font-semibold italic text-[#f6e3b4]" aria-live="polite">
        {revealed ? <span className="sr-only">{`Save the date: ${c.dateLabel}`}</span> : "Rub the gold leaf with your finger"}
      </p>
      {revealed ? (
        <a href={calUrl} target="_blank" rel="noreferrer" className="pill mt-3 bg-[#f1d596] text-[#4a0f1c] shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:bg-[#fbe7a8]">Add to calendar</a>
      ) : (
        <button type="button" onClick={() => setRevealed(true)} className="mt-3 legible text-xs font-semibold uppercase tracking-[.3em] text-white/90 underline decoration-white/50 underline-offset-8 hover:text-white">Reveal without scratching</button>
      )}
    </div>
  );
}

/** Scene: the embers of the sacred fire drift up into a night sky; the save-the-date card hangs in it. */
export default function SaveDateScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: sp } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const emberQ = useTransform(sp, [0, .45], [0, 1]);
  return (
    <section ref={ref} className="relative overflow-hidden px-5 pb-28 pt-32" aria-label="Save the date">
      <Embers q={emberQ} count={30} className="z-[1]" />
      <FloatingLanterns p={sp} density={.3} className="z-[1] opacity-80" />
      <motion.div className="relative z-[2] mx-auto max-w-md" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-12% 0px" }} transition={{ duration: .9, ease: [.2, .7, .2, 1] }}>
        <p className="legible text-center font-display text-xs font-semibold tracking-[.42em] text-[#f6dc96]">A SMALL SURPRISE</p>
        <h2 className="mb-10 mt-3 legible text-center font-serif text-4xl font-semibold text-[#fff6e0] sm:text-5xl">When shall we meet?</h2>
        <Card />
      </motion.div>
    </section>
  );
}
