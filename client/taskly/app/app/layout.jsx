"use client";
import Navbar from "@/ui/app/Navbar";
import NotificationMenu from "@/ui/app/NotificationMenu/NotificationMenu.jsx";
import NotificationWrapper from "@/ui/app/NotificationWrapper/NotificationWrapper.jsx";
import SearchMenu from "@/ui/app/searchMenu/SearchMenu.jsx";
import TaskMenu from "@/ui/app/TaskMenu/TaskMenu.jsx";
import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { MenuContext } from "../../context/MenuContext.js";
import { NotificationsContext } from "../../context/NotificationsContext.js";
import { useTask } from "../../context/TaskContext.js";
import { useUser } from "../../context/UserContext.js";

export default function AppLayout({ children }) {
  const { user, loading } = useUser();
  const { notificationsList } = useContext(NotificationsContext);
  const { activeTask } = useTask();
  const { isTaskMenuOpen, isSearchMenuOpen } = useContext(MenuContext);

  useEffect(() => {
    if (!user && !loading) {
      redirect("/auth");
    }
  }, [user, loading]);

  return (
    <>
      <Navbar user={user} />
      <TaskMenu id={activeTask} visibility={isTaskMenuOpen} />
      <SearchMenu visibility={isSearchMenuOpen}></SearchMenu>
      <NotificationWrapper>
        {notificationsList
          .slice()
          .reverse()
          .map((notification) => (
            <NotificationMenu data={notification} key={notification.id} />
          ))}
      </NotificationWrapper>
      {children}
    </>
  );
}
