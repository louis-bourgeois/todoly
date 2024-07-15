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
      boxShadow: {
        shadow_01: "0px 6px 8px 3px rgba(0, 0, 0, 0.25)",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1720px",
        "4xl": "1920px",
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
