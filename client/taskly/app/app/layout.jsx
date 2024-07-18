"use client";
import MobileFooter from "@/ui/_mobile/app/Footer/MobileFooter.jsx";
import MobileHeader from "@/ui/_mobile/app/Header/MobileHeader.jsx";
import MobileViewsMenu from "@/ui/_mobile/viewsMenu/MobileViewsMenu.jsx";
import Navbar from "@/ui/app/Navbar.jsx";
import NotificationMenu from "@/ui/app/NotificationMenu/NotificationMenu.jsx";
import NotificationWrapper from "@/ui/app/NotificationWrapper/NotificationWrapper.jsx";
import SearchMenu from "@/ui/app/searchMenu/SearchMenu.jsx";
import TaskMenu from "@/ui/app/TaskMenu/TaskMenu.jsx";
import ViewsMenu from "@/ui/app/viewsMenu/ViewsMenu.jsx";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { useMenu } from "../../context/MenuContext.js";
import { NotificationsContext } from "../../context/NotificationsContext.js";
import { useScreen } from "../../context/ScreenContext.js";
import { useTask } from "../../context/TaskContext.js";
import { useUser } from "../../context/UserContext.js";
import { useWorkspace } from "../../context/WorkspaceContext.js";

export default function AppLayout({ children }) {
  const { isMobile } = useScreen();
  const { loading, isAuthenticated, checkAuth } = useAuth();
  const { activeTask } = useTask();
  const { user } = useUser();
  const { activeWorkspace } = useWorkspace();
  const {
    isTaskMenuOpen,
    toggleSearchMenu,
    isViewsMenuOpen,
    toggleViewsMenu,
    isMobileViewsMenuOpen,
  } = useMenu();
  const { notificationsList } = useContext(NotificationsContext);

  const router = useRouter();

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

  // useEffect(() => {
  //   console.log("ok", loading, isAuthenticated);
  //   const verifyAuth = async () => {
  //     if (!loading && !isAuthenticated) {
  //       await checkAuth();
  //       if (!isAuthenticated) {
  //         console.log("ok", router.push("/auth/login"));
  //       }
  //     }
  //   };
  //   verifyAuth();
  // }, [loading, isAuthenticated, checkAuth, router]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  // if (!isAuthenticated) {
  //   return null;
  // }

  if (isMobile) {
    return (
      <>
        <MobileViewsMenu isVisible={isMobileViewsMenuOpen} />
        <MobileHeader />
        {children}
        <MobileFooter />
      </>
    );
  }  else {
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
}
