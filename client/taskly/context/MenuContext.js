"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useTask } from "./TaskContext";
import { useWorkspace } from "./WorkspaceContext";

const MenuContext = createContext();

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export const MenuProvider = ({ children }) => {
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [isViewsMenuOpen, setIsViewsMenuOpen] = useState(false);
  const [isMobileViewsMenuOpen, setIsMobileViewsMenuOpen] = useState(false);
  const [element, setElement] = useState("");
  const [cardType, setCardType] = useState("default");

  const { setActiveTask } = useTask();
  const { setActiveWorkspace } = useWorkspace();
  useEffect(() => {
    console.log("changed : ", isMobileViewsMenuOpen);
  }, [isMobileViewsMenuOpen]);
  const toggleTaskMenu = (taskId = "", workspaceId = "", el) => {
    const availableElements = ["Workspace", "Task"];
    if (el !== "" && availableElements.includes(el)) {
      setElement(el);
    } else if (el !== "") {
      console.error("Invalid passed el props in menuContext/taskMenu");
    }

    setIsTaskMenuOpen((prev) => !prev);

    if (taskId) setActiveTask(taskId);
    if (workspaceId) setActiveWorkspace(workspaceId);
  };

  const toggleSearchMenu = () => setIsSearchMenuOpen((prev) => !prev);

  const toggleViewsMenu = () => {
    setIsViewsMenuOpen((prev) => {
      console.log("Toggling ViewsMenu. New state:", !prev);
      return !prev;
    });
  };

  const value = {
    isTaskMenuOpen,
    toggleTaskMenu,
    isSearchMenuOpen,
    toggleSearchMenu,
    isViewsMenuOpen,
    toggleViewsMenu,
    element,
    setElement,
    isMobileViewsMenuOpen,
    setIsMobileViewsMenuOpen,
    cardType,
    setCardType,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
