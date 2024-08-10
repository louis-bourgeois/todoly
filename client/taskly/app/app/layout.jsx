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
import { useEffect, useMemo, useRef, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../../context/AuthContext.js";
import { useMenu } from "../../context/MenuContext.js";
import { useScreen } from "../../context/ScreenContext.js";
import { useTask } from "../../context/TaskContext.js";
import { useUser } from "../../context/UserContext.js";
import { useUserPreferences } from "../../context/UserPreferencesContext.js";
import { useWorkspace } from "../../context/WorkspaceContext.js";

const SLIDE_NUMBER = 14;
const ELEMENTS = ["Task", "Workspace", "Note"];

const AddWorkspaceBubble = ({ onDontShowAgain }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setOpacity(0);
    }, 4500);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 left-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg p-4 z-50 transition-opacity duration-500 ease-in-out`}
      style={{ opacity }}
    >
      <div className="mb-2">
        <h3 className="font-semibold text-lg">Astuce</h3>
      </div>
      <p className="text-sm mb-3">
        Faites défiler horizontalement pour ajouter d'autres types d'éléments
      </p>
      <div className="flex justify-end">
        <button
          onClick={onDontShowAgain}
          className="text-xs bg-white text-blue-500 px-3 py-1 rounded hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        >
          Do not show again
        </button>
      </div>
    </div>
  );
};

const CardWrapper = ({ children }) => {
  return (
    <div className={`flex items-center justify-center h-full pb-[2vh]`}>
      {children}
    </div>
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
const AddWorkspaceCard = () => {
  const { setCardType } = useMenu();
  return (
    <Card cardType="All" isVisible={true} isTransitioning={false}>
      <CardContent cardType="All">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-bold mb-4">Add a new workspace</h2>
          <p className="text-center mb-4">
            Create a new workspace to organize your tasks and projects
          </p>
          <button
            onClick={() => setCardType("Add")}
            className="bg-dominant text-text font-bold p-4 rounded-full"
          >
            Create Workspace
          </button>
        </div>
      </CardContent>
    </Card>
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
          className="absolute top-0 left-0 w-full pointer-events-none bg-primary"
          style={{
            height: `${(index + 1) * (32 / layers)}px`,

            opacity: 1 - index / layers,
            zIndex: layers - index,
          }}
        />
      ))}
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

  const [showAddWorkspaceBubble, setShowAddWorkspaceBubble] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentCardType, setCurrentCardType] = useState(cardType);
  const [nextCardType, setNextCardType] = useState(null);
  const transitionTimeoutRef = useRef(null);

  const swiperRef = useRef(null);
  const router = useRouter();
  const currentWorkspaceTasks = useMemo(() => {
    return workspaces.find((w) => w.id === currentWorkspace)?.tasks || [];
  }, [workspaces, currentWorkspace]);

  const sortedTasks = useMemo(() => {
    return [
      ...currentWorkspaceTasks.filter((task) => task.id === activeTask),
      ...currentWorkspaceTasks.filter((task) => task.id !== activeTask),
    ];
  }, [currentWorkspaceTasks, activeTask]);

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
      if (swiperRef.current && swiperRef.current.swiper && cardType !== "Add") {
        swiperRef.current.swiper.slideTo(0);
      } else if (cardType === "Add") {
        if (currentCardType === "Workspace" || currentCardType === "All") {
          swiperRef.current.swiper.slideTo(ELEMENTS.indexOf("Workspace"));
        } else if (
          currentCardType === "Task" ||
          currentCardType === "Currently"
        ) {
          swiperRef.current.swiper.slideTo(ELEMENTS.indexOf("Task"));
        }
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
        if (index === workspaces.length) {
          return <AddWorkspaceCard />;
        }
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
  if (cardType === "App") {
    return <>{children}</>;
  }
  if (isMobile && cardType !== "Profile" && cardType !== "App") {
    return (
      <>
        <MobileViewsMenu isVisible={isMobileViewsMenuOpen} />
        <MobileHeader />

        <div
          className={`w-full overflow-x-visible flex ${
            cardType === "Search" && "mt-auto"
          }`}
        >
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            centeredSlides={true}
            spaceBetween={0}
            mousewheel={false}
            className="mySwiper"
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
              [...workspaces, { id: "add-workspace" }]
                .sort((a, b) => {
                  if (a.id === "add-workspace") return 1;
                  if (b.id === "add-workspace") return -1;
                  return b.tasks.length - a.tasks.length;
                })
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
            <AddWorkspaceBubble onDontShowAgain={handleDontShowAgain} />
          )}
      </>
    );
  }
  if (window.location.href === "/app") {
    return <>{children}</>;
  } else if (window.location.href !== `/app` && preferences.Default_Main_Page) {
    return (
      <>
        <Navbar />
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
  } else {
    return null;
  }
}
