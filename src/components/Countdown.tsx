import { useEffect, useState } from "react";
import { content as c } from "../content";

const left = () => Math.max(0, new Date(c.dateISO).getTime() - Date.now());
export function useCountdown() {
  const [ms, setMs] = useState(left);
  useEffect(() => { const t = setInterval(() => setMs(left()), 1000); return () => clearInterval(t); }, []);
  return Math.floor(ms / 1000);
}

/** "Until we are one": live countdown + date. Used wherever a scene needs a calm moment of text. */
export default function Countdown({ className = "" }: { className?: string }) {
  const secs = useCountdown();
  const units = [["Days", Math.floor(secs / 86400)], ["Hours", Math.floor(secs / 3600) % 24], ["Min", Math.floor(secs / 60) % 60], ["Sec", secs % 60]] as const;
  return (
    <div className={`legible relative flex flex-col items-center px-5 text-center ${className}`}>
      {/* soft dark patch so the numbers read on any part of the painting */}
      <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10" style={{ background: "radial-gradient(closest-side, rgba(14,5,10,.62), rgba(14,5,10,.3) 60%, transparent)" }} />
      <p className="font-serif text-lg italic tracking-wide text-white/90 sm:text-xl">Until we are one</p>
      <div className="mt-5 grid w-full max-w-sm grid-cols-4 gap-2.5">
        {units.map(([label, v]) => (
          <div key={label} className="rounded-2xl bg-[#2a0a14]/60 py-4 ring-1 ring-[#f1d596]/40">
            <div className="font-display text-[1.7rem] font-medium leading-none text-[#fbf5e6] tabular-nums">{String(v).padStart(2, "0")}</div>
            <div className="mt-2 text-[10px] font-medium uppercase tracking-[.25em] text-[#f1d596]">{label}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 font-serif text-lg italic text-white/90">{c.dateLabel}</p>
    </div>
  );
}
