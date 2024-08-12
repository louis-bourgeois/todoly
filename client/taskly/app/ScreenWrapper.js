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
      document.documentElement.classList.remove(
        "theme-light",
        "theme-blue",
        "theme-dark"
      );
      if (!["/"].includes(pathname)) {
        switch (preferences.Color_Theme.toLowerCase()) {
          case "#ffffff":
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
      } else {
        document.documentElement.classList.add("theme-dark");
      }
    }
    return () => {
      document.documentElement.classList.remove("light", "blue", "dark");
    };
  }, [preferences, pathname]);

  if (!isMounted) {
    return null;
  }

  let wrapperClassName = "text-shadow-01 ";
  if (
    ["/auth/", "/auth/login", "/auth/signup", "/features", "/pricing"].includes(
      pathname
    )
  ) {
    wrapperClassName += `h-[100vh] overflow-y-auto overflow-x-none flex flex-col items-center gap-[20vh] ${
      !isMobile && "px-[9vw]"
    } `;
  } else if (isMobile) {
    wrapperClassName += "h-full w-full";
  } else {
    wrapperClassName += "h-full";
  }

  if (pathname === "/") {
    return (
      <div
        className={`overflow-x-none flex flex-col items-center gap-[20vh]`}
      >
        {children}
      </div>
    );
  } else {
    return { children };
  }
}
