/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "3xs": "0.375rem",
      "2xs": "0.5rem",
      "1.5xs": "0.675rem",
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      m: "1.25rem",
      lg: "1.50rem",
      xl: "1.75rem",
      "2xl": "2rem",
      "2.5xl": "2.5rem",
      "3xl": "3rem",
      "4xl": "4rem",
      "5xl": "5rem",
    },
    extend: {
      zIndex: {
        40: "40",
      },
      boxShadow: {
        shadow_01: "0px 6px 8px 3px rgba(0, 0, 0, 0.25)",
        shadow_02: "0px 3px 4px 3px rgba(0, 0, 0, 0.25)",
        shadow_card: "7px 10px 12px 4px rgba(0, 0, 0, 0.25)",
      },
      screens: {
        "2xs": "200px",
        xs: "400px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "3xl": "1720px",
        "4xl": "1920px",
        "5xl": "2510px",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        inter: ["var(--font-inter)"],
        overusedGrotesk: ["var(--font-overused-grotesk)"],
      },
      letterSpacing: {
        "overused-grotesk": "-0.025em", // -2.5%
      },
      lineHeight: {
        "overused-grotesk": "var(--overused-grotesk-line-height, 0.75)", // Réduit de 0.8 à 0.75
      },
      padding: {
        "text-trim-top": "var(--overused-grotesk-trim-top, 0.05em)", // Réduit de 0.1em à 0.05em
        "text-trim-bottom": "var(--overused-grotesk-trim-bottom, 0.25em)", // Augmenté de 0.2em à 0.25em
      },
      colors: {
        ternary: "#E8F3FF",
        pink: "#de9f9f",
        light_blue: "#",
        black: "#0D0C0C",
        dominant: "#007aff",
        grey: "#959595",
        CTA_bg: "#A2CEFE",
        grey2: "#818181",
        "span-home-title": "#d2a5a5",
        purple: "#EA96FF",
        white: "#FFF",
        important: "#FA3766",
        landing_page_bg: "#F7F4ED",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".text-trim": {
          lineHeight: theme("lineHeight.overused-grotesk"),
          paddingTop: theme("padding.text-trim-top"),
          paddingBottom: theme("padding.text-trim-bottom"),
          display: "inline-block",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
