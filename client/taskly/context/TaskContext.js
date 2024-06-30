"use client";
import { createContext, useContext, useState } from "react";

const TaskContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [activeTask, setActiveTask] = useState(null);

  return (
    <TaskContext.Provider value={{ activeTask, setActiveTask }}>
      {children}
    </TaskContext.Provider>
  );
};
