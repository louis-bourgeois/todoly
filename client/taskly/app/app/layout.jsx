"use client";
import Card from "@/ui/_mobile/app/Cards/Card";
import MobileCardHeader from "@/ui/_mobile/app/Cards/Card_header/MobileCardHeader";
import MobileSectionContainer from "@/ui/_mobile/app/Cards/SectionContainer/MobileSectionContainer";
import TaskView from "@/ui/_mobile/app/Cards/TaskView.jsx";
import WorkspaceView from "@/ui/_mobile/app/Cards/WorkspaceView.jsx";
import MobileMainMenu from "@/ui/_mobile/app/Footer/MainMenu/MobileMainMenu.jsx";
import MobileFooter from "@/ui/_mobile/app/Footer/MobileFooter.jsx";
import MobileSearchResults from "@/ui/_mobile/app/Footer/SearchSections/searchMenu/MobileSearchResults.jsx";
import MobileHeader from "@/ui/_mobile/app/Header/MobileHeader.jsx";
import NoteLayout from "@/ui/_mobile/app/MenuLayouts/Note/NoteLayout";
import TaskLayout from "@/ui/_mobile/app/MenuLayouts/Task/TaskLayout";
import WorkspaceLayout from "@/ui/_mobile/app/MenuLayouts/Workspace/WorkspaceLayout";
import MobileViewsMenu from "@/ui/_mobile/viewsMenu/MobileViewsMenu.jsx";
import Navbar from "@/ui/app/Navbar.jsx";
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
    currentCardType: contextCurrentCardType,
    nextCardType: contextNextCardType,
    setCurrentCardType: setContextCurrentCardType,
    setNextCardType: setContextNextCardType,
  } = useMenu();

  const { notificationsList } = useContext(NotificationsContext);
  const [showAddWorkspaceBubble, setShowAddWorkspaceBubble] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCardType, setCurrentCardType] = useState(cardType);
  const [nextCardType, setNextCardType] = useState(null);
  const transitionTimeoutRef = useRef(null);

  const swiperRef = useRef(null);
  const router = useRouter();
  const currentWorkspaceTasks =
    workspaces.find((w) => w.id === currentWorkspace)?.tasks || [];
  const sortedTasks = [
    ...currentWorkspaceTasks.filter((task) => task.id === activeTask),
    ...currentWorkspaceTasks.filter((task) => task.id !== activeTask),
  ];

  useEffect(() => {
    setCurrentCardType(cardType);
    setContextCurrentCardType(cardType);
  }, [cardType, setContextCurrentCardType]);

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
      setNextCardType(cardType);
      setContextNextCardType(cardType);
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(0);
      }
      // Début de la transition
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentCardType(cardType);
        setContextCurrentCardType(cardType);
        setIsTransitioning(false);
        setNextCardType(null);
        setContextNextCardType(null);
      }, 300); // Durée de la transition en ms
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [
    cardType,
    currentCardType,
    setContextCurrentCardType,
    setContextNextCardType,
  ]);

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

  const renderCardContent = (task, index, workspace = null) => {
    const getDateForIndex = (index) => {
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    };

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
              <MobileSectionContainer date={getDateForIndex(index)} />
            </ScrollableContent>
          </CardContent>
        </Card>
      ),
      All: () => {
        return (
          <Card
            cardType={currentCardType}
            isVisible={true}
            isTransitioning={isTransitioning}
          >
            <CardContent cardType={currentCardType}>
              <MobileCardHeader index={index} workspace={workspace} />
              <ScrollableContent>
                <MobileSectionContainer selectedWorkspace={workspace} />
              </ScrollableContent>
            </CardContent>
          </Card>
        );
      },
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
      Workspace: () => (
        <Card
          cardType={currentCardType}
          isVisible={true}
          isTransitioning={isTransitioning}
        >
          <CardContent cardType={currentCardType}>
            {workspace ? (
              <WorkspaceView id={workspace.id}></WorkspaceView>
            ) : (
              <div>No workspace selected</div>
            )}
          </CardContent>
        </Card>
      ),
      Search: () => (
        <Card
          cardType={currentCardType}
          isVisible={true}
          isTransitioning={isTransitioning}
        >
          <CardContent cardType={currentCardType}>
            <MobileSearchResults />
          </CardContent>
        </Card>
      ),
      Default: () => {
        return (
          <Card
            cardType={currentCardType}
            isVisible={true}
            isTransitioning={isTransitioning}
          >
            <CardContent cardType={currentCardType}>
              <div>Default card content</div>
            </CardContent>
          </Card>
        );
      },
    };

    const CardComponent = cardTypes[currentCardType] || cardTypes.Default;
    return CardComponent();
  };

  useEffect(() => {
    const verifyAuth = async () => {
      if (!loading && !isAuthenticated) {
        await checkAuth();
        if (!isAuthenticated) {
          router.push("/auth/login");
        }
      }
    };
    verifyAuth();
  }, [loading, isAuthenticated, checkAuth, router]);

  if (loading) {
    return null;
  }
  if (!isAuthenticated) {
    return null;
  }

  if (isMobile && cardType === "Profile") {
    return (
      <>
        {children}
        <footer className="px-[17.5px] w-full flex flex-col items-center justify-between gap-[2vh]">
          <MobileMainMenu />
        </footer>
      </>
    );
  }
  if (isMobile && cardType !== "Profile") {
    return (
      <>
        <MobileViewsMenu isVisible={isMobileViewsMenuOpen} />
        <MobileHeader />

        <div
          className={`w-full overflow-visible ${
            cardType === "Search" && "mt-auto"
          }`}
        >
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
                  <CardWrapper cardType={currentCardType}>
                    {renderCardContent(task, index)}
                  </CardWrapper>
                </SwiperSlide>
              ))
            ) : currentCardType === "Workspace" ? (
              workspaces
                .sort((a, b) => b.tasks.length - a.tasks.length)
                .map((workspace, index) => (
                  <SwiperSlide key={index}>
                    <CardWrapper cardType={currentCardType}>
                      {renderCardContent(null, index, workspace)}
                    </CardWrapper>
                  </SwiperSlide>
                ))
            ) : currentCardType === "Currently" ||
              nextCardType === "Currently" ? (
              [...Array(SLIDE_NUMBER)].map((_, index) => (
                <SwiperSlide key={index}>
                  <CardWrapper cardType={currentCardType}>
                    {renderCardContent(null, index)}
                  </CardWrapper>
                </SwiperSlide>
              ))
            ) : currentCardType === "All" || nextCardType === "All" ? (
              workspaces
                .sort((a, b) => b.tasks.length - a.tasks.length)
                .map((workspace, index) => (
                  <SwiperSlide key={index}>
                    <CardWrapper cardType={currentCardType}>
                      {renderCardContent(null, index, workspace)}
                    </CardWrapper>
                  </SwiperSlide>
                ))
            ) : currentCardType === "Add" ? (
              [...Array(ELEMENTS.length)].map((_, index) => (
                <SwiperSlide key={index}>
                  <CardWrapper cardType={currentCardType}>
                    {renderCardContent(null, index)}
                  </CardWrapper>
                </SwiperSlide>
              ))
            ) : currentCardType === "Search" ? (
              <SwiperSlide>
                <CardWrapper cardType={currentCardType}>
                  {renderCardContent(null, null)}
                </CardWrapper>
              </SwiperSlide>
            ) : (
              <SwiperSlide>
                <CardWrapper cardType={currentCardType}>
                  {renderCardContent(null, 0)}
                </CardWrapper>
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
        {children}
      </>
    );
  }
}

const CardWrapper = ({ children, cardType }) => {
  return (
    <div className={`flex items-center justify-center h-full`}>{children}</div>
  );
};

const CardContent = ({ children, el, cardType }) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col ${
        (el === "Task" || cardType === "Task" || cardType === "Workspace") &&
        "justify-between pb-[8px]"
      }`}
    >
      {children}
    </div>
  );
};

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
