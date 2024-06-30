/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      zIndex: {
        40: "40",
      },
      screens: {
        "3xl": "1919px",
        "4xl": "2199px",
        "5xl": "2559px",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
      },
      colors: {
        black: "#0D0C0C",
        blue: "#007aff",
        grey: "#959595",
        grey2: "#818181",
        "span-home-title": "#d2a5a5",
        purple: "#EA96FF",
      },
    },
  },
  plugins: [],
};
