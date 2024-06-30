"use client";
import { createContext, useContext } from "react";
import { useUser } from "./UserContext";

const SectionContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ children }) => {
  const { user } = useUser();

  return (
    <SectionContext.Provider value={{}}>{children}</SectionContext.Provider>
  );
};
