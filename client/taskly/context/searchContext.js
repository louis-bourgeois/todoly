"use client";
import { createContext, useContext, useState } from "react";

const MobileSearchContext = createContext();

export const MobileSearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [commandMode, setCommandMode] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <MobileSearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        suggestions,
        setSuggestions,
        commandMode,
        setCommandMode,
        selectedTask,
        setSelectedTask,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      {children}
    </MobileSearchContext.Provider>
  );
};

export const useMobileSearch = () => useContext(MobileSearchContext);
