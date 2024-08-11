"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useScreen } from "../context/ScreenContext.js";
import { useUserPreferences } from "../context/UserPreferencesContext.js";

export default function ScreenWrapper({ children }) {
  const { isMobile, isDelayActive } = useScreen();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { preferences } = useUserPreferences();

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
  useEffect(() => {
    if (preferences?.Color_Theme) {
      console.log(preferences.Color_Theme);
      // Supprimer toutes les classes de thème existantes
      document.documentElement.classList.remove(
        "theme-light",
        "theme-blue",
        "theme-dark"
      );

      // Ajouter la nouvelle classe de thème
      switch (preferences.Color_Theme.toLowerCase()) {
        case "#ffffff":
          break;
        case "#f7f4ed":
          break;
        case "#007aff":
          document.documentElement.classList.add("theme-blue");
          break;
        case "#000000":
          document.documentElement.classList.add("theme-dark");
          break;
        default:
          console.log("Thème non reconnu:", preferences.Color_Theme);
      }
    }
    return () => {
      document.documentElement.classList.remove("light", "blue", "dark");
    };
  }, [preferences]);

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
    wrapperClassName += `h-[100vh] overflow-y-auto overflow-x-none flex flex-col items-center gap-[20vh] ${
      !isMobile && "px-[9vw]"
    } `;
  } else if (isMobile) {
    wrapperClassName += "h-full w-full";
  } else {
    wrapperClassName += "h-full";
  }

  return (
    <div
      className={`overflow-hidden transition-opacity duration-300 ${
        isDelayActive ? "opacity-0" : "opacity-100"
      } ${wrapperClassName} ${
        !isMobile && " absolute w-[100vw] h-[100vh] inset-0 z-0"
      } `}
    >
      {isMobile ? (
        <main
          className={`flex flex-col items-start justify-between py-[20px] ${
            ["profile"].includes(pathname) && "h-[100vh]"
          }`}
        >
          {children}
        </main>
      ) : (
        children
      )}
    </div>
  );
}
