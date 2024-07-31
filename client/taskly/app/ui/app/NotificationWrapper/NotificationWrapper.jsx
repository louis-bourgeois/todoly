"use client";
import { useContext, useEffect } from "react";
import { NotificationsContext } from "../../../../context/NotificationsContext";
import { useScreen } from "../../../../context/ScreenContext";
import NotificationMenu from "../NotificationMenu/NotificationMenu";

export default function NotificationWrapper() {
  const { deleteNotification, notificationsList } =
    useContext(NotificationsContext);
  const { isMobile } = useScreen();

  useEffect(() => {
    const timers = notificationsList.map((notification) =>
      setTimeout(() => deleteNotification(notification.id), 6500)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [notificationsList, deleteNotification]);

  return (
    <div
      className={`
      fixed top-0 right-0 flex flex-col items-end p-4 overflow-y-auto z-[49] 
      ${isMobile ? "w-full max-h-[30vh] gap-1" : "max-h-[20vh] ga-10"}
    `}
    >
      {notificationsList
        .slice()
        .reverse()
        .map((notification) => (
          <NotificationMenu
            data={notification}
            key={notification.id}
            isMobile={isMobile}
          />
        ))}
    </div>
  );
}
