/** Small traditional ornaments, drawn in code so they stay crisp and weigh nothing. */

/** A toran: a string of marigolds and pennants that hangs across the top of a card. */
export function Toran({ className = "" }: { className?: string }) {
  const N = 13, W = 400;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1), x = 14 + t * (W - 28), y = 8 + Math.sin(t * Math.PI) * 14;
    return { x, y, i };
  });
  const cols = ["#8c1d3a", "#e8a317", "#1f7a6e", "#c2410c"];
  return (
    <svg viewBox={`0 0 ${W} 74`} className={className} aria-hidden="true" preserveAspectRatio="xMidYMin meet">
      <path d={`M0 8 Q${W / 2} 36 ${W} 8`} fill="none" stroke="#c99a3c" strokeWidth="1.6" />
      {pts.map((p) => (
        <g key={p.i}>
          <path d={`M${p.x - 9} ${p.y + 2} L${p.x + 9} ${p.y + 2} L${p.x} ${p.y + 40} Z`} fill={cols[p.i % cols.length]} stroke="#f1d596" strokeWidth=".9" />
          <path d={`M${p.x - 4} ${p.y + 8} L${p.x + 4} ${p.y + 8} L${p.x} ${p.y + 20} Z`} fill="#f6dc96" opacity=".55" />
          <circle cx={p.x} cy={p.y + 2} r="5.2" fill="#ffb21e" stroke="#c2410c" strokeWidth=".8" />
          <circle cx={p.x} cy={p.y + 2} r="1.8" fill="#c2410c" />
        </g>
      ))}
    </svg>
  );
}

/** Lotus divider: a thin gold line, a small lotus and dots. */
export function LotusDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 26" className={className} aria-hidden="true">
      <path d="M0 13H84M136 13H220" stroke="#c99a3c" strokeWidth="1" opacity=".8" />
      <g fill="none" stroke="#f1d596" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M110 4C104 9 104 17 110 22C116 17 116 9 110 4Z" />
        <path d="M110 22C100 20 94 15 93 9C101 10 107 14 110 22Z" />
        <path d="M110 22C120 20 126 15 127 9C119 10 113 14 110 22Z" />
      </g>
      <circle cx="88" cy="13" r="1.6" fill="#f1d596" /><circle cx="132" cy="13" r="1.6" fill="#f1d596" />
    </svg>
  );
}

/** The gold frame used across the invitation (same family as the save-the-date card). */
export const GOLD = "linear-gradient(160deg,#f6dc96,#b9852a 45%,#f1d596 70%,#a8741f)";
