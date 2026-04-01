"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";

const DemoModeContext = createContext({
  isDemoMode: false,
  mapAppRoute: (path) => path,
});

export const DemoModeProvider = ({ children }) => {
  const pathname = usePathname() || "";
  const isDemoMode = pathname === "/demo" || pathname.startsWith("/demo/");

  const mapAppRoute = useCallback(
    (path = "/app") => {
      if (!isDemoMode) return path;
      return path.replace(/^\/app(?=\/|$)/, "/demo");
    },
    [isDemoMode]
  );

  const value = useMemo(
    () => ({
      isDemoMode,
      mapAppRoute,
    }),
    [isDemoMode, mapAppRoute]
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => useContext(DemoModeContext);
