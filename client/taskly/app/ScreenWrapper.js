"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScreen } from "../context/ScreenContext.js";

const VALID_THEMES = ["#ffffff,#de9f9f", "#000000", "#f7f4ed"];
const DEFAULT_BG = "#FFF";

export default function ScreenWrapper({ children }) {
  const { isMobile, isDelayActive } = useScreen();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isMobile) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobile]);

  if (!isMounted) {
    return null; // ou un spinner de chargement
  }

  let wrapperClassName = "text-shadow-01 ";
  if (
    [
      "/",
      "/auth/",
      "/auth/login",
      "/auth/signup",
      "/features",
      "/pricing",
    ].includes(pathname)
  ) {
    wrapperClassName += `h-[100vh] overflow-y-auto overflow-x-none flex flex-col items-center gap-[30vh] ${
      !isMobile && "px-[9vw]"
    } `;
  } else if (isMobile) {
    wrapperClassName += "h-full w-full";
  } else {
    wrapperClassName += "h-full";
  }

  return (
    <div
      className={`transition-opacity duration-300 ${
        isDelayActive ? "opacity-0" : "opacity-100"
      } ${wrapperClassName} ${
        !isMobile && " absolute w-[100vw] h-[100vh] inset-0 z-0"
      } `}
    >
      {isMobile ? (
        <main className="flex flex-col items-start justify-between py-[20px]">
          {children}
        </main>
      ) : (
        children
      )}
    </div>
  );
}
