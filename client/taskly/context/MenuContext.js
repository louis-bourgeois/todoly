"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useTask } from "./TaskContext";
import { useUserPreferences } from "./UserPreferencesContext";
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
  const pathname = usePathname();
  const { preferences } = useUserPreferences();
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [isViewsMenuOpen, setIsViewsMenuOpen] = useState(false);
  const [isMobileViewsMenuOpen, setIsMobileViewsMenuOpen] = useState(false);
  const [element, setElement] = useState("");

  const [cardType, setCardType] = useState(preferences.Default_Main_Page);
  const [currentCardType, setCurrentCardType] = useState(cardType);
  const [nextCardType, setNextCardType] = useState(null);

  const { setActiveTask } = useTask();
  const { setActiveWorkspace } = useWorkspace();

  useEffect(() => {
    console.log("Initial cardType:", cardType);
    console.log("Initial currentCardType:", currentCardType);
    console.log("Initial nextCardType:", nextCardType);
  }, []);

  useEffect(() => {
    const updateCardType = () => {
      const lastSegment = pathname.split("/").pop();
      const newCardType =
        lastSegment.charAt(0).toUpperCase() +
        lastSegment.slice(1).toLowerCase();
      setCardType(newCardType);
    };
    updateCardType();
  }, [pathname]);

  useEffect(() => {
    setCurrentCardType(cardType);
  }, [cardType]);

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

  const toggleSearchMenu = () => {
    setIsSearchMenuOpen((prev) => !prev);
  };

  const toggleViewsMenu = () => {
    setIsViewsMenuOpen((prev) => !prev);
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
    currentCardType,
    setCurrentCardType,
    nextCardType,
    setNextCardType,
  };
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export default MenuProvider;
