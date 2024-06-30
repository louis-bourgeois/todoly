"use client";
import { createContext, useState } from "react";
import { useTask } from "./TaskContext";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const { setActiveTask } = useTask();
  const toggleTaskMenu = (id = "") => {
    setIsTaskMenuOpen((prev) => !prev);
    if (id) {
      setActiveTask(id);
    }
  };
  const toggleSearchMenu = () => {
    setIsSearchMenuOpen((prev) => !prev);
  };
  return (
    <MenuContext.Provider
      value={{
        isTaskMenuOpen,
        toggleTaskMenu,
        isSearchMenuOpen,
        toggleSearchMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
