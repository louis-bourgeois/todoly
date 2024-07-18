"use client";
import { poppins } from "@/font";
import { useScreen } from "../context/ScreenContext.js";

export default function ScreenWrapper({ children }) {
  const { isMobile } = useScreen();

  if (isMobile) {
    return (
      <html
        lang="en"
        className={`${poppins.className} h-full w-full overflow-hidden`}
      >
        <body className="text-shadow-01 h-full overflow-hidden">
          <main className="flex flex-col items-start justify-between h-full py-[20px]">
            {children}
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${poppins.className} h-full`}>
      <body className="text-shadow-01 h-full">{children}</body>
    </html>
  );
}
