// contexts/ScreenContext.js
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const value = useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <ScreenContext.Provider value={value}>{children}</ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};
