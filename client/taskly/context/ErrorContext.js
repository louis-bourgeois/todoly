"use client";
import { createContext, useContext, useEffect } from "react";
import { NotificationsContext } from "./NotificationsContext";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const { addNotification, notificationsList } =
    useContext(NotificationsContext);

  useEffect(() => {}, [notificationsList]);

  const handleError = (error) => {
    console.error(error); // Log the error for debugging
    addNotification({
      title: error.response.data.title,
      subtitle: error.response.data.subtitle,
      error: true,
      tag: "Error",
      tagColor: "#F00",
    });
  };

  return (
    <ErrorContext.Provider value={{ handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  return useContext(ErrorContext);
};
