/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { sandstone: "#E6C280", twilight: "#1B4965", sky: "#2B6CB0", mint: "#7FB7A9", mintlight: "#C2E0D8", amber: "#FF9F1C", maroon: "#5E1224", teal: "#2F7F78", ink: "#10222b" },
    fontFamily: { serif: ['"Cormorant Garamond"', "Georgia", "serif"], display: ['"Cinzel"', "Georgia", "serif"], sans: ['"Montserrat"', "system-ui", "sans-serif"] },
  } },
  plugins: [],
};
