"use client";
import { createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Use UUID for unique ID generation

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notificationsList, setNotificationLists] = useState([]);

  useEffect(() => {
    console.log("====================================");
    console.log(notificationsList);
    console.log("====================================");
  }, [notificationsList]);
  const addNotification = (notificationData) => {
    console.log(notificationData);
    const newNotification = {
      id: uuidv4(),
      ...notificationData,
    };
    setNotificationLists((prev) => [newNotification, ...prev]);
  };

  const deleteNotification = (id) => {
    setNotificationLists((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const modifyNotification = (id, updatedData) => {
    setNotificationLists((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, ...updatedData }
          : notification
      )
    );
  };

  const findNotificationByTitle = (title) => {
    return notificationsList.find(
      (notification) => notification.title === title
    );
  };
  return (
    <NotificationsContext.Provider
      value={{
        notificationsList,
        addNotification,
        deleteNotification,
        modifyNotification,
        findNotificationByTitle,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
