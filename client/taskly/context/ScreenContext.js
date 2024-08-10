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
      const newIsMobile = newWidth < 1024;

      // Check if isMobile needs to change
      if (newIsMobile !== isMobile) {
        setIsDelayActive(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          setIsMobile(newIsMobile);
          setIsDelayActive(false);
          timeoutRef.current = null;
        }, 200); // Délai de 250 millisecondes
      }
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
  }, [isMobile]);

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
