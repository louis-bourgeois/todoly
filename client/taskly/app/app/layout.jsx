"use client";
import Card from "@/ui/_mobile/app/Cards/Card";
import MobileCardHeader from "@/ui/_mobile/app/Cards/Card_header/MobileCardHeader";
import MobileSectionContainer from "@/ui/_mobile/app/Cards/SectionContainer/MobileSectionContainer";
import TaskView from "@/ui/_mobile/app/Cards/TaskView.jsx";
import MobileFooter from "@/ui/_mobile/app/Footer/MobileFooter.jsx";
import MobileHeader from "@/ui/_mobile/app/Header/MobileHeader.jsx";
import NoteLayout from "@/ui/_mobile/app/MenuLayouts/Note/NoteLayout";
import TaskLayout from "@/ui/_mobile/app/MenuLayouts/Task/TaskLayout";
import WorkspaceLayout from "@/ui/_mobile/app/MenuLayouts/Workspace/WorkspaceLayout";
import MobileViewsMenu from "@/ui/_mobile/viewsMenu/MobileViewsMenu.jsx";
import Navbar from "@/ui/app/Navbar.jsx";
import NotificationMenu from "@/ui/app/NotificationMenu/NotificationMenu.jsx";
import NotificationWrapper from "@/ui/app/NotificationWrapper/NotificationWrapper.jsx";
import SearchMenu from "@/ui/app/searchMenu/SearchMenu.jsx";
import TaskMenu from "@/ui/app/TaskMenu/TaskMenu.jsx";
import ViewsMenu from "@/ui/app/viewsMenu/ViewsMenu.jsx";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../../context/AuthContext.js";
import { useMenu } from "../../context/MenuContext.js";
import { NotificationsContext } from "../../context/NotificationsContext.js";
import { useScreen } from "../../context/ScreenContext.js";
import { useTask } from "../../context/TaskContext.js";
import { useUser } from "../../context/UserContext.js";
import { useUserPreferences } from "../../context/UserPreferencesContext.js";
import { useWorkspace } from "../../context/WorkspaceContext.js";

const SLIDE_NUMBER = 14;
const ELEMENTS = ["Task", "Workspace", "Note"];

const AddWorkspaceBubble = ({ onClose, onDontShowAgain }) => {
  return (
    <div className="fixed inset-0 left-2 bg-dominant text-white rounded-full shadow-lg p-3 max-w-xs z-50 animate-fade-in-out flex items-center">
      <p className="text-xs mr-2">
        Scroll horizontally to add other element's type
      </p>
      <button
        onClick={onDontShowAgain}
        className="text-xs underline hover:text-blue-200 transition-colors"
      >
        Do not show again
      </button>
    </div>
  );
};

export default function AppLayout({ children }) {
  const { addUserPreference, preferences } = useUserPreferences();
  const { isMobile } = useScreen();
  const { loading, isAuthenticated, checkAuth } = useAuth();
  const { activeTask } = useTask();
  const { user } = useUser();
  const { currentWorkspace, workspaces, activeWorkspace } = useWorkspace();
  const {
    isTaskMenuOpen,
    toggleSearchMenu,
    isViewsMenuOpen,
    toggleViewsMenu,
    isMobileViewsMenuOpen,
    cardType,
  } = useMenu();
  const { notificationsList } = useContext(NotificationsContext);
  const [showAddWorkspaceBubble, setShowAddWorkspaceBubble] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCardType, setCurrentCardType] = useState(cardType);
  const timeoutRef = useRef(null);
  const swiperRef = useRef(null);
  const router = useRouter();

  const currentWorkspaceTasks =
    workspaces.find((w) => w.id === currentWorkspace)?.tasks || [];
  console.log("====================================");
  console.log(workspaces, currentWorkspaceTasks, currentWorkspace);
  console.log("====================================");
  const sortedTasks = [
    ...currentWorkspaceTasks.filter((task) => task.id === activeTask),
    ...currentWorkspaceTasks.filter((task) => task.id !== activeTask),
  ];
  useEffect(() => {
    setCurrentCardType(cardType);
  }, [cardType]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        toggleSearchMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearchMenu]);

  useEffect(() => {
    if (isMobile && cardType === "Add") {
      setShowAddWorkspaceBubble(true);
      const timer = setTimeout(() => setShowAddWorkspaceBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, cardType]);

  useEffect(() => {
    if (cardType !== currentCardType) {
      setIsTransitioning(true);
      swiperRef.current.swiper.slideTo(0, 0);
      const timer = setTimeout(() => {
        setCurrentCardType(cardType);

        setIsTransitioning(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [cardType, currentCardType]);

  const handleDontShowAgain = async () => {
    await addUserPreference({
      key: "Do_Not_Show_Add_Scroll_Popup_Again",
      value: "true",
    });
    setShowAddWorkspaceBubble(false);
  };

  const renderMenu = (el) => {
    const menuComponents = {
      Task: TaskLayout,
      Workspace: WorkspaceLayout,
      Note: NoteLayout,
    };
    const MenuComponent = menuComponents[el];
    return MenuComponent ? <MenuComponent /> : null;
  };

  const renderCardContent = (task, index) => {
    const cardTypes = {
      Currently: () => (
        <Card
          cardType={currentCardType}
          isVisible={true}
          isTransitioning={isTransitioning}
        >
          <CardContent cardType={currentCardType}>
            <MobileCardHeader index={index} />
            <ScrollableContent>
              <MobileSectionContainer />
            </ScrollableContent>
          </CardContent>
        </Card>
      ),
      Add: () => {
        const el = ELEMENTS[index % ELEMENTS.length];
        return (
          <Card
            cardType={currentCardType}
            el={el}
            isVisible={true}
            isTransitioning={isTransitioning}
          >
            <CardContent cardType={currentCardType} el={el}>
              {renderMenu(el)}
            </CardContent>
          </Card>
        );
      },
      Task: () => (
        <Card
          cardType={currentCardType}
          isVisible={true}
          isTransitioning={isTransitioning}
        >
          <CardContent cardType={currentCardType}>
            {task ? <TaskView id={task.id} /> : <div>No task selected</div>}
          </CardContent>
        </Card>
      ),
      Default: () => (
        <Card
          cardType={currentCardType}
          isVisible={true}
          isTransitioning={isTransitioning}
        >
          <CardContent el={currentCardType}>
            {renderMenu(currentCardType)}
          </CardContent>
        </Card>
      ),
    };

    return (cardTypes[currentCardType] || cardTypes.Default)();
  };
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
        <div className="w-full overflow-visible">
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={0}
            mousewheel={false}
            className="mySwiper h-full"
          >
            {currentCardType === "Task" && sortedTasks.length > 0 ? (
              sortedTasks.map((task, index) => (
                <SwiperSlide key={task.id}>
                  <CardWrapper>{renderCardContent(task, index)}</CardWrapper>
                </SwiperSlide>
              ))
            ) : currentCardType === "Currently" ? (
              [...Array(SLIDE_NUMBER)].map((_, index) => (
                <SwiperSlide key={index}>
                  <CardWrapper>{renderCardContent(null, index)}</CardWrapper>
                </SwiperSlide>
              ))
            ) : currentCardType === "Add" ? (
              [...Array(ELEMENTS.length)].map((_, index) => (
                <SwiperSlide key={index}>
                  <CardWrapper>{renderCardContent(null, index)}</CardWrapper>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <CardWrapper>{renderCardContent(null, 0)}</CardWrapper>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
        <MobileFooter />
        {showAddWorkspaceBubble &&
          !preferences.Do_Not_Show_Add_Scroll_Popup_Again && (
            <AddWorkspaceBubble
              onClose={() => setShowAddWorkspaceBubble(false)}
              onDontShowAgain={handleDontShowAgain}
            />
          )}
      </>
    );
  } else {
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

const CardWrapper = ({ children }) => (
  <div className="flex items-center justify-center h-full">{children}</div>
);

const CardContent = ({ children, el, cardType }) => (
  <div
    className={`relative w-full h-full flex flex-col ${
      (el === "Task" || cardType === "Task") && "justify-between pb-[8px]"
    }`}
  >
    {children}
  </div>
);

const ScrollableContent = ({ children }) => {
  const layers = 8; // Nombre de couches pour le dégradé

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Contenu défilable */}
      <div className="absolute inset-0 overflow-y-auto">{children}</div>

      {/* Couches de dégradé simulé */}
      {[...Array(layers)].map((_, index) => (
        <div
          key={index}
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{
            height: `${(index + 1) * (32 / layers)}px`,
            backgroundColor: "white",
            opacity: 1 - index / layers,
            zIndex: layers - index,
          }}
        />
      ))}
    </div>
  );
};
