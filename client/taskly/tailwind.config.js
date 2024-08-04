/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
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
      lg: "1.5rem",
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
        shadow_card_desktop: "0px 4px 45px 2px rgba(0, 0, 0, 0.25)",
      },
      screens: {
        "2xs": "200px",
        xs: "400px",
        ...defaultTheme.screens,
        "3xl": "1720px",
        "4xl": "1920px",
        "5xl": "2510px",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
        inter: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        overusedGrotesk: [
          "var(--font-overused-grotesk)",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      letterSpacing: {
        "overused-grotesk": "-0.025em",
      },
      lineHeight: {
        "overused-grotesk": "var(--overused-grotesk-line-height, 0.75)",
      },
      padding: {
        "text-trim-top": "var(--overused-grotesk-trim-top, 0.05em)",
        "text-trim-bottom": "var(--overused-grotesk-trim-bottom, 0.25em)",
      },
      colors: {
        primary: "var(--color-primary)",
        "secondary-overlay": "rgba(var(--color-secondary-rgb), 0.5)",
        bg: "var(--color-background)",
        "bg-overlay": "var(--color-background-overlay)",
        dominant: "var(--color-dominant)",
        secondary: "var(--color-secondary)",
        ternary: "var(--color-ternary)",
        "ternary-section-header": "var(--color-ternary-section-header)",
        "ternary-2": "var(--color-ternary-2)",
        text: "var(--color-text)",
        important: "var(--color-important)",
        grey: "var(--color-grey)",
        white: "#fff",
        main_menu_bg: "var(--main-menu-bg)",
      },
      backgroundImage: {
        "gradient-1": "var(--gradient-1)",
        "gradient-2": "var(--gradient-2)",
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
        ".bg-secondary-10": {
          "background-color": "rgba(var(--color-secondary-rgb), 0.1)",
        },
        // Vous pouvez ajouter d'autres niveaux d'opacité si nécessaire
        ".bg-secondary-20": {
          "background-color": "rgba(var(--color-secondary-rgb), 0.2)",
        },
        ".bg-secondary-30": {
          "background-color": "rgba(var(--color-secondary-rgb), 0.3)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
