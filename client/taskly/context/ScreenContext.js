"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(null);
  const [isDelayActive, setIsDelayActive] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setIsDelayActive(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        setIsMobile(newWidth < 1024);
        setIsDelayActive(false);
        timeoutRef.current = null;
      }, 250); // Délai de 1 seconde
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ScreenContext.Provider value={{ isMobile, isDelayActive }}>
      {children}
    </ScreenContext.Provider>
  );
};

export const useScreen = () => {
  const context = useContext(ScreenContext);
  if (context === undefined) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};
