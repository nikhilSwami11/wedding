import { useEffect, useState } from "react";

export const CASTLE = "/art/castle.webp";
export const DOOR_L = "/art/door-left.webp";
export const DOOR_R = "/art/door-right.webp";

// castle painting is 1536x2752. The pointed doorway (both door leaves) in that painting:
export const CW = 1536, CH = 2752, CX = 769, TOP = 1624, SPRING = 1761, BOT = 2112, LEFT = 637, RIGHT = 901;
export const ARCH = `M${LEFT} ${BOT} V${SPRING} Q${LEFT + 8} 1690 ${CX} ${TOP} Q${RIGHT - 8} 1690 ${RIGHT} ${SPRING} V${BOT} Z`;
export const LEAF_L = `M${LEFT} ${BOT} V${SPRING} Q${LEFT + 8} 1690 ${CX} ${TOP} V${BOT} Z`;
export const LEAF_R = `M${RIGHT} ${BOT} V${SPRING} Q${RIGHT - 8} 1690 ${CX} ${TOP} V${BOT} Z`;
export const MID_Y = (TOP + BOT) / 2;

/** True when the screen is wide enough that the castle is shown as a full-width, bottom-aligned band. */
export function useWide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth / window.innerHeight > 0.8);
  useEffect(() => {
    const f = () => setWide(window.innerWidth / window.innerHeight > 0.8);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return wide;
}

/**
 * The castle exactly as the gate scene frames it at scroll 0 (same crop, same closed carved doors),
 * so the hero can dissolve into it and the gate scene can take over without a single pixel changing.
 */
export default function CastleBackdrop() {
  const wide = useWide();
  return (
    <svg viewBox={wide ? `0 600 ${CW} 1560` : `0 0 ${CW} ${CH}`} preserveAspectRatio={wide ? "xMidYMax slice" : "xMidYMid slice"} className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="pc-leafL"><path d={LEAF_L} /></clipPath>
        <clipPath id="pc-leafR"><path d={LEAF_R} /></clipPath>
        <mask id="pc-hole" maskUnits="userSpaceOnUse" x="0" y="0" width={CW} height={CH}>
          <rect width={CW} height={CH} fill="#fff" />
          <path d={ARCH} fill="#000" />
        </mask>
      </defs>
      <image href={CASTLE} width={CW} height={CH} mask="url(#pc-hole)" preserveAspectRatio="none" />
      <g clipPath="url(#pc-leafL)"><path d={LEAF_L} fill="#2e1b10" /><image href={DOOR_L} x={LEFT} y={TOP} width={CX - LEFT} height={BOT - TOP} preserveAspectRatio="none" /></g>
      <g clipPath="url(#pc-leafR)"><path d={LEAF_R} fill="#2e1b10" /><image href={DOOR_R} x={CX} y={TOP} width={RIGHT - CX} height={BOT - TOP} preserveAspectRatio="none" /></g>
    </svg>
  );
}
