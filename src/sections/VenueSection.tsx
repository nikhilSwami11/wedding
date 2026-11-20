import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { content as c, mapUrl } from "../content";
import { GOLD, LotusDivider, Toran } from "../components/Ornaments";

const VENUE = "Mewar Haveli Palace Resort";
const ADDRESS = "Fateh Sagar Road, Udaipur, Rajasthan 313001";

/** Venue: a toran across the top, the map in a gold jharokha arch with a warm antique tone, and diyas along the sill. */
export default function VenueSection() {
  const q = `${VENUE} ${ADDRESS}`;
  return (
    <section className="relative px-5 pb-16 pt-20" aria-label="Venue">
      <div className="mx-auto max-w-md">
        <Toran className="mx-auto w-full" />
        <div className="legible -mt-1 text-center">
          <LotusDivider className="mx-auto mb-3 w-40" />
          <p className="text-xs font-semibold uppercase tracking-[.42em] text-[#f6dc96]">Venue</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#fff6e0] sm:text-5xl">{VENUE}</h2>
          <p className="mx-auto mt-3 flex max-w-xs items-start justify-center gap-2 text-base leading-relaxed text-white/90"><MapPin size={16} className="mt-1 shrink-0 text-[#f6dc96]" />{ADDRESS}</p>
        </div>

        {/* the map, set in a gold arch like a palace window */}
        <div className="relative mx-auto mt-8 w-full rounded-t-[999px] rounded-b-[28px] p-[7px] shadow-[0_30px_70px_-20px_rgba(0,0,0,.75)]" style={{ background: GOLD }}>
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[22px] bg-[#1a0d12]">
            <iframe title={`Map of ${VENUE}`} src={`https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="block h-[340px] w-full border-0 [filter:grayscale(1)_sepia(.6)_saturate(1.5)_brightness(.86)_contrast(1.05)]" />
            {/* warm vignette so the map melts into the frame */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(42,10,20,.75)]" />
            <div className="pointer-events-none absolute inset-0 bg-[#7a1830]/10 mix-blend-multiply" />
          </div>
        </div>

        {/* diyas on the sill */}
        <div className="relative -mt-9 flex justify-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-[110%] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(closest-side, rgba(255,170,60,.38), transparent)" }} />
          <img src="/decor/diyas.webp" alt="" className="relative w-[74%] select-none" draggable={false} loading="lazy" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {[[<CalendarDays key="d" size={15} />, "Dates", "13 – 16 May 2027"], [<MapPin key="c" size={15} />, "City", c.city]].map(([icon, label, value]) => (
            <div key={label as string} className="rounded-2xl p-[1.5px]" style={{ background: GOLD }}>
              <div className="h-full rounded-[14px] bg-gradient-to-b from-[#3a0f20]/95 to-[#1d0912]/95 px-4 py-4 text-center">
                <div className="mx-auto flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[.25em] text-[#f6dc96]">{icon}{label}</div>
                <div className="mt-2 font-serif text-xl font-semibold leading-snug text-[#fff6e0]">{value}</div>
              </div>
            </div>
          ))}
        </div>

        <a href={mapUrl(q)} target="_blank" rel="noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-semibold uppercase tracking-[.2em] text-[#3d0a17] shadow-[0_14px_36px_-10px_rgba(0,0,0,.7)] transition active:scale-[.99]" style={{ background: GOLD }}>
          Get directions <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
