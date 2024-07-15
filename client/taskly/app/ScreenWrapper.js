"use client";
import { poppins } from "@/font";
import { useScreen } from "../context/ScreenContext.js";

export default function ScreenWrapper({ children }) {
  const { isMobile } = useScreen();
  if (isMobile) {
    return (
      <html lang="en" className={poppins.className + " h-[100dvh]"}>
        <body
          className={`text-shadow-01  h-[100dvh] max-h-full overflow-hidden`}
        >
          <main className="flex flex-col items-start justify-center gap-[30x] mt-[40px] mb-[20px] mx-[17.5px] h-[872px]">
            {children}
          </main>
        </body>
      </html>
    );
  }
  return (
    <html lang="en" className={poppins.className + " h-[100vh]"}>
      <body className={`text-shadow-01 `}>{children}</body>
    </html>
  );
}
