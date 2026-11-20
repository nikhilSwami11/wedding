/** Single source of truth. Edit text here; anything in [BRACKETS] is a placeholder. */
export const content = {
  bride: "Charu",
  groom: "Vaibhav",
  dateISO: "2027-05-15T19:00:00+05:30",
  dateLabel: "Saturday, 15 May 2027",
  city: "Udaipur, Rajasthan",
  invocation: "ॐ श्री गणेशाय नमः",
  blessing: "With the heavenly blessings of our elders and families",
  whatsapp: "[WHATSAPP NUMBER]", // digits with country code, e.g. 919876543210
  music: "", // e.g. "/music/shehnai.mp3"
  // The couple scene after the doors open: the empty castle interior fills the screen and the couple stands in it.
  // png: transparent PNG of the couple. bgTall: empty interior, portrait (phones). bgWide: empty interior, landscape (desktop; optional).
  // Until png AND bgTall exist, the open doorway shows the painting instead.
  couple: { png: "/art/couple.webp", bgTall: "/art/courtyard.webp", bgWide: "" },
  // Small transparent PNGs layered over the Mehendi scene (see IMAGE_PROMPTS.md). Any file that is not in /public/mehendi/ is skipped.
  // x / y = centre of the piece in % of the screen column, w = width in %, depth = scroll parallax (-1..1), rot = degrees, z = 0 behind the arch / 1 in front.
  mehendiLayers: [
    { src: "/mehendi/petals.webp", x: 50, y: 36, w: 92, depth: -.35, z: 0 },
    { src: "/mehendi/mogra.webp", x: 88, y: 10, w: 20, depth: .35, rot: 20, z: 1 },
    { src: "/mehendi/paisley.webp", x: 86, y: 28, w: 18, depth: .3, rot: 15, z: 1 },
    { src: "/mehendi/paisley.webp", x: 10, y: 42, w: 14, depth: .7, rot: -30, z: 1 },
    { src: "/mehendi/hands.webp", x: 50, y: 56, w: 52, depth: .15, z: 1 },
    { src: "/mehendi/cone.webp", x: 82, y: 52, w: 15, depth: .6, rot: 25, z: 1 },
  ] as { src: string; x: number; y: number; w: number; depth: number; rot?: number; z: 0 | 1 }[],
  events: [
    { id: "mehendi", name: "Mehendi", date: "Thursday, 13 May 2027", time: "4:00 PM onwards", venue: "Mewar Haveli · Zenana Terrace", map: "Mewar Haveli Fateh Sagar Road Udaipur", art: "/art/cypress.webp" },
    { id: "haldi", name: "Haldi", date: "Thursday, 13 May 2027", time: "10:30 AM", venue: "Mewar Haveli · Garden Courtyard", map: "Mewar Haveli Fateh Sagar Road Udaipur", art: "/art/haldi.webp" },
    { id: "sangeet", name: "Sangeet", date: "Friday, 14 May 2027", time: "7:30 PM", venue: "Mewar Haveli · Grand Lawn", map: "Mewar Haveli Fateh Sagar Road Udaipur" },
    { id: "wedding", name: "Wedding", date: "Saturday, 15 May 2027", time: "Baraat 6:30 PM · Pheras 8:00 PM", venue: "Mewar Haveli · Royal Mandap Lawn", map: "Mewar Haveli Fateh Sagar Road Udaipur" },
    { id: "reception", name: "Reception", date: "Sunday, 16 May 2027", time: "8:00 PM", venue: "Mewar Haveli · Darbar Hall", map: "Mewar Haveli Fateh Sagar Road Udaipur", art: "/art/courtyard.webp" },
  ],
};
export const mapUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
