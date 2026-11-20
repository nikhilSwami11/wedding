import { content as c } from "../content";

export default function FooterSection() {
  return (
    <footer className="legible relative bg-gradient-to-t from-[#120508]/90 via-[#120508]/65 to-transparent px-6 pb-12 pt-24 text-center">
      <div className="mx-auto mb-8 h-px w-16 bg-[#f6dc96]/80" />
      <p className="font-serif text-4xl font-semibold text-[#fff6e0]">{c.bride} <span className="text-[#f6dc96]">&amp;</span> {c.groom}</p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[.4em] text-white/90">{c.dateLabel}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[.4em] text-white/90">{c.city}</p>
      <p className="mx-auto mt-8 max-w-xs font-serif text-xl font-semibold italic leading-snug text-white">We cannot wait to celebrate with you.</p>
      <p className="mt-12 text-[11px] font-semibold uppercase tracking-[.35em] text-white/70">Made with love</p>
    </footer>
  );
}
