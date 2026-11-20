import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { content as c } from "../content";
import { GOLD, LotusDivider, Toran } from "../components/Ornaments";

const real = /^\d{8,15}$/.test(c.whatsapp);

/** RSVP: a gold-framed card under a toran, lit by diyas. One tap opens WhatsApp with the reply already written. */
export default function RsvpSection() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState(1);
  const send = (yes: boolean) => {
    const who = name.trim() || "A guest";
    const text = yes
      ? `Namaste! ${who} here. We are delighted to attend ${c.bride} & ${c.groom}'s wedding${guests > 1 ? ` (${guests} guests)` : ""}.`
      : `Namaste! ${who} here. We are sorry we cannot attend ${c.bride} & ${c.groom}'s wedding, but send our love and blessings.`;
    window.open(`https://wa.me/${real ? c.whatsapp : ""}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };
  const field = "w-full rounded-xl border border-[#c99a3c]/50 bg-[#1a0912]/70 px-4 py-3.5 text-base text-[#fff6e0] placeholder-[#fff6e0]/45 outline-none transition focus:border-[#f6dc96] focus:bg-[#1a0912]/90";
  const label = "mb-2 block text-xs font-semibold uppercase tracking-[.25em] text-[#f6dc96]";
  return (
    <section className="relative px-5 pb-48 pt-20" aria-label="RSVP">
      <div className="relative mx-auto max-w-md">
        <Toran className="relative z-[1] mx-auto -mb-3 w-[92%]" />
        <div className="rounded-[28px] p-[2px] shadow-[0_40px_90px_-30px_rgba(0,0,0,.85)]" style={{ background: GOLD }}>
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-b from-[#3a0f20]/95 via-[#240b17]/95 to-[#14070f]/95 px-6 pb-16 pt-9 sm:px-9">
            <div className="pointer-events-none absolute inset-0 opacity-[.07]" style={{ backgroundImage: "url(/art/lattice.webp)", backgroundSize: "420px" }} />
            <div className="relative text-center">
              <LotusDivider className="mx-auto mb-3 w-36" />
              <p className="text-xs font-semibold uppercase tracking-[.42em] text-[#f6dc96]">RSVP</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#fff6e0]">Will you join us?</h2>
              <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-white/85">Please let us know by 15 April 2027. Your reply opens in WhatsApp, already written.</p>
            </div>

            <div className="relative mt-8 space-y-5">
              <label className="block">
                <span className={label}>Full name</span>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className={field} />
              </label>
              <div>
                <span className={label}>Number of guests</span>
                <div className="flex items-center justify-between rounded-xl border border-[#c99a3c]/50 bg-[#1a0912]/70 p-1.5">
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests(Math.max(1, guests - 1))} className="grid h-11 w-11 place-items-center rounded-lg text-[#f6dc96] transition hover:bg-white/10 active:scale-95"><Minus size={16} /></button>
                  <span className="font-serif text-2xl font-semibold tabular-nums text-[#fff6e0]" aria-live="polite">{guests}</span>
                  <button type="button" aria-label="More guests" onClick={() => setGuests(Math.min(10, guests + 1))} className="grid h-11 w-11 place-items-center rounded-lg text-[#f6dc96] transition hover:bg-white/10 active:scale-95"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <button type="button" onClick={() => send(true)} className="relative mt-8 w-full rounded-2xl px-6 py-4 text-sm font-semibold uppercase tracking-[.2em] text-[#3d0a17] shadow-[0_14px_36px_-10px_rgba(0,0,0,.8)] transition active:scale-[.99]" style={{ background: GOLD }}>
              Confirm attendance
            </button>
            <button type="button" onClick={() => send(false)} className="relative mt-3 w-full rounded-xl px-6 py-3 text-sm font-semibold tracking-wide text-white/90 transition hover:text-white">
              Unable to attend
            </button>
          </div>
        </div>

        {/* diyas light the base of the card */}
        <div className="pointer-events-none absolute -bottom-36 left-1/2 w-[96%] -translate-x-1/2">
          <div className="absolute left-1/2 top-1/2 h-44 w-[115%] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(closest-side, rgba(255,170,60,.45), transparent)" }} />
          <img src="/decor/diyas.webp" alt="" className="relative w-full select-none" draggable={false} loading="lazy" />
        </div>
      </div>
    </section>
  );
}
