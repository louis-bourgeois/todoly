import localFont from "next/font/local";
export const overusedGrotesk = localFont({
  src: [
    {
      path: "./OverusedGrotesk-VF.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-overused-grotesk",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});
