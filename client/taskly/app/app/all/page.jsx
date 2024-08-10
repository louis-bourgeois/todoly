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
    speed: 300,
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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
