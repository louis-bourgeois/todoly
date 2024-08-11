"use client";
import SectionContainer from "@/ui/app/currently/SectionContainer";
import SlideNav from "@/ui/app/currently/SlideNav";
import SlickCarousel from "@/ui/app/SlickCarousel";
import Slide from "@/ui/app/Slide";
import { useEffect, useState } from "react";
import { useMenu } from "../../../context/MenuContext";
import { useWorkspace } from "../../../context/WorkspaceContext";

export default function Page() {
  const { workspaces } = useWorkspace();
  const { toggleTaskMenu } = useMenu();
  const { deleteWorkspace } = useWorkspace();
  const [filteredTasks, setFilteredTasks] = useState({});
  const { toggleViewsMenu } = useMenu();

  const settings = {
    dots: false,
    infinite: false,
    speed: 600,
    centerMode: true,
    centerPadding: "40px",
    slidesToScroll: 0.5,
    arrows: false,
  };

  useEffect(() => {
    let allTasks = workspaces.flatMap((w) => {
      return w.tasks.map((task) => ({ ...task, workspace_id: w.id }));
    });

    // Group tasks by workspace
    const tasksByWorkspace = allTasks.reduce((acc, task) => {
      if (!acc[task.workspace_id]) {
        acc[task.workspace_id] = [];
      }
      acc[task.workspace_id].push(task);
      return acc;
    }, {});

    setFilteredTasks(tasksByWorkspace);
  }, [workspaces]);

  const handleAddWorkspace = () => {
    toggleTaskMenu(null, null, "Workspace");
  };
  const handleDeleteWorkspace = async (workspaceId) => {
    await deleteWorkspace(workspaceId);
  };
  return (
    <SlickCarousel settings={settings}>
      {workspaces
        .sort((a, b) => b.tasks.length - a.tasks.length)
        .map((workspace, index) => {
          const workspaceTasks = filteredTasks[workspace.id] || [];
          return (
            <Slide
              index={index}
              key={workspace.id}
              className={`transition-all duration-300`}
            >
              <SlideNav key={index}>
                <div className="flex justify-between items-center gap-2">
                  {" "}
                  <h2 className="text-3xl font-extrabold  bg-gradient-2 bg-clip-text text-transparent inline-block">
                    {workspace.name}
                  </h2>
                  <button
                    onClick={() => {
                      toggleTaskMenu(null, workspace.id, "Workspace");
                    }}
                    className="text-text mr-4 px-2 mt-1.5 rounded-full hover:bg-blue hover:bg-opacity-10 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 12 12"
                      fill="none"
                      className="cursor-pointer flex-shrink-0 group transition-colors duration-300 ease-in-out"
                    >
                      <g clipPath="url(#clip0_1050_205)">
                        <path
                          d="M10.64 3.20003L5.86995 7.97C5.39495 8.445 3.98494 8.665 3.66994 8.35C3.35494 8.035 3.56994 6.625 4.04494 6.15L8.81995 1.37501C8.9377 1.24654 9.08025 1.14327 9.23905 1.07142C9.3978 0.99957 9.5695 0.96062 9.74375 0.95695C9.91795 0.953285 10.0912 0.984955 10.2528 1.05006C10.4145 1.11517 10.5613 1.21237 10.6843 1.33577C10.8074 1.45917 10.9042 1.60622 10.9688 1.76805C11.0335 1.92988 11.0647 2.10313 11.0606 2.27736C11.0564 2.45158 11.017 2.62318 10.9447 2.78175C10.8724 2.94033 10.7688 3.08262 10.64 3.20003Z"
                          className="stroke-secondary group-hover:stroke-dominant  transition-colors duration-300 ease-in-out"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.5 2H3C2.46956 2 1.96089 2.21071 1.58581 2.58578C1.21074 2.96086 1 3.46956 1 4V9C1 9.53045 1.21074 10.0391 1.58581 10.4142C1.96089 10.7893 2.46956 11 3 11H8.5C9.605 11 10 10.1 10 9V6.5"
                          className="stroke-secondary group-hover:stroke-dominant "
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1050_205">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between ">
                  {workspace.name !== "Personal" && (
                    <button
                      onClick={() => handleDeleteWorkspace(workspace.id)}
                      className="mr-4 p-2 rounded-full hover:bg-blue hover:bg-opacity-10 transition-colors duration-200 w-[50%] flex justify-between"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path
                            d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"
                            stroke="#FA3766"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                          <path
                            d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"
                            stroke="#FA3766"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                          <path
                            d="M12 13V18"
                            stroke="#FA3766"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                          <path
                            d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"
                            stroke="#FA3766"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>{" "}
                        </g>
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={toggleViewsMenu}
                    className="mr-4 p-2 rounded-full hover:bg-blue hover:bg-opacity-10 transition-colors duration-200 flex justify-between"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-dominant"
                    >
                      <path
                        d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </SlideNav>
              <SectionContainer
                selectedWorkspace={workspace}
                tasks={workspaceTasks}
              />
            </Slide>
          );
        })}
      <Slide index={workspaces.length} key="add-workspace">
        <div className="flex items-center justify-center h-full">
          <button
            onClick={handleAddWorkspace}
            className="
            relative
            px-8 py-4
            bg-dominant
            text-primary
            rounded-full
            text-lg font-semibold
            shadow-shadow_01
            transition-all duration-300 ease-in-out
            transform hover:scale-105
            overflow-hidden
            group
          "
          >
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              Add Workspace
            </span>
            <span
              className={`
            absolute inset-0
            bg-gradient-to-r from-dominant to-ternary
            opacity-0
            transition-opacity duration-300 ease-in-out
          `}
            ></span>
          </button>
        </div>
      </Slide>
    </SlickCarousel>
  );
}
