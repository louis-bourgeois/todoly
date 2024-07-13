"use client";
import { createContext, useContext } from "react";

const SectionContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ children }) => {
  return (
    <SectionContext.Provider value={{}}>{children}</SectionContext.Provider>
  );
};
