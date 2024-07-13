"use client";
import Navbar from "@/ui/app/Navbar";
import NotificationMenu from "@/ui/app/NotificationMenu/NotificationMenu.jsx";
import NotificationWrapper from "@/ui/app/NotificationWrapper/NotificationWrapper.jsx";
import SearchMenu from "@/ui/app/searchMenu/SearchMenu.jsx";
import TaskMenu from "@/ui/app/TaskMenu/TaskMenu.jsx";
import ViewsMenu from "@/ui/app/viewsMenu/ViewsMenu.jsx";
import { redirect } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useMenu } from "../../context/MenuContext.js";
import { NotificationsContext } from "../../context/NotificationsContext.js";
import { useTask } from "../../context/TaskContext.js";
import { useUser } from "../../context/UserContext.js";
import { useUserPreferences } from "../../context/UserPreferencesContext.js";
import { useWorkspace } from "../../context/WorkspaceContext.js";

export default function AppLayout({ children }) {
  const { loading } = useAuth();
  const { activeTask } = useTask();
  const { user } = useUser();
  const { activeWorkspace } = useWorkspace();
  const { preferences } = useUserPreferences();
  const {
    isTaskMenuOpen,
    toggleSearchMenu,
    isViewsMenuOpen,
    toggleViewsMenu,
    element,
  } = useMenu();
  const { notificationsList } = useContext(NotificationsContext);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    console.log("isViewsMenuOpen changed:", isViewsMenuOpen);
    console.log(element);
  }, [isViewsMenuOpen, element]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        toggleSearchMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    console.log(hasRedirected);
    if (!user && !loading) {
      redirect("/auth");
    } else if (!hasRedirected) {
      console.log(preferences);
      const destination = preferences?.Default_Main_Page
        ? `/app/${preferences.Default_Main_Page.toLowerCase()}`
        : window.location.pathname;
      if (window.location.pathname !== destination) {
        setHasRedirected(true);
        redirect(destination);
      }
    }
  }, [user, loading, hasRedirected]);

  return (
    <>
      <Navbar user={user} />
      {isViewsMenuOpen && (
        <ViewsMenu
          options={[
            {
              title: "Sort by",
              items: ["Creation date", "Tags", "Importance", "Last updated"],
            },
            {
              title: "Show",
              items: ["All tasks", "Completed only", "Todo only"],
            },
          ]}
          isOpen={isViewsMenuOpen}
          onClose={toggleViewsMenu}
        />
      )}
      <SearchMenu />
      <TaskMenu
        taskId={activeTask}
        workspaceId={activeWorkspace}
        visibility={isTaskMenuOpen}
      />
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
