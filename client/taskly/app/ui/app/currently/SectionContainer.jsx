import AutoResizeInput from "@/ui/_mobile/app/AutoResizeInput";
import Task from "@/ui/app/Task/Task";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useError } from "../../../../context/ErrorContext";
import { useMenu } from "../../../../context/MenuContext";
import { useSection } from "../../../../context/SectionContext";
import { useTask } from "../../../../context/TaskContext";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";

const SectionContainer = ({
  date = undefined,
  selectedWorkspace = undefined,
}) => {
  const { tasks } = useTask();
  const { sections, deleteSection, modifySection } = useSection();
  const { handleError } = useError();
  const { preferences } = useUserPreferences();
  const { currentWorkspace } = useWorkspace();
  const { toggleTaskMenu } = useMenu();
  const [sectionTasks, setSectionsTasks] = useState(new Map());
  const [workspace, setWorkspace] = useState(currentWorkspace);
  const headerRefs = useRef({});
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [localSectionName, setLocalSectionName] = useState("");

  useEffect(() => {
    setWorkspace(selectedWorkspace?.id || currentWorkspace);
  }, [currentWorkspace, selectedWorkspace]);

  const expandTask = useCallback(
    (taskId) => {
      toggleTaskMenu(taskId, null);
    },
    [toggleTaskMenu]
  );

  const filteredSections = useMemo(
    () =>
      sections
        .filter((section) => section.workspace_id === workspace)
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        ),
    [sections, workspace]
  );

  const handleDeleteSection = async (sectionId) => {
    try {
      await deleteSection(sectionId);
    } catch (error) {
      console.error("Failed to delete section", error);
      handleError(error);
    }
  };

  useEffect(() => {
    const taskMap = new Map();
    let allTasks = [...tasks];

    const sortFunctions = {
      "Creation date": (a, b) =>
        new Date(b.creation_date) - new Date(a.creation_date),
      Tags: () => 0,
      Importance: (a, b) => b.priority - a.priority,
      "Last updated": (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    };
    allTasks.sort(sortFunctions[preferences.Sort_By] || (() => 0));

    const filterFunctions = {
      "Completed only": (task) => task.status === "done",
      "Todo only": (task) => task.status !== "done",
      "All tasks": () => true,
    };
    allTasks = allTasks.filter(
      filterFunctions[preferences.Show] || (() => true)
    );

    filteredSections.forEach((section) => {
      const sectionTasksFiltered = allTasks.filter(
        (task) =>
          task &&
          task.linked_section === section.id &&
          (!date || task.due_date === date)
      );
      if (sectionTasksFiltered.length > 0) {
        taskMap.set(section.id, sectionTasksFiltered);
      }
    });
    setSectionsTasks(taskMap);
  }, [tasks, filteredSections, date, preferences]);

  useEffect(() => {
    const handleResize = () => {
      setSectionsTasks(new Map(sectionTasks));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sectionTasks]);

  const handleEditSection = (sectionId, sectionName) => {
    setEditingSectionId(sectionId);
    setLocalSectionName(sectionName);
  };

  const handleSectionNameChange = async (newName, sectionId) => {
    try {
      await modifySection(newName, sectionId);
      setEditingSectionId(null);
    } catch (error) {
      console.error("Failed to update section: ", error);
      handleError(error);
    }
  };

  const handleSectionNameInputChange = (e) => {
    setLocalSectionName(e.target.value);
  };

  const handleSectionNameInputBlur = () => {
    if (editingSectionId && localSectionName.trim() !== "") {
      handleSectionNameChange(localSectionName, editingSectionId);
    } else {
      setEditingSectionId(null);
    }
  };

  const handleSectionNameInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSectionNameInputBlur();
    } else if (e.key === "Escape") {
      setEditingSectionId(null);
    }
  };

  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="flex mt-[0.1%]">
        {filteredSections.map((section) => {
          const sectionTasksList = sectionTasks.get(section.id) || [];

          if (sectionTasksList.length === 0) return null;

          return (
            <div
              key={`${section.id}-${tasks.length}-${tasks
                .map((task) => task.id)
                .join("-")}`}
              className="flex flex-col h-full p-10 py-0 gap-[7.5px]"
            >
              <div
                ref={(el) => (headerRefs.current[section.id] = el)}
                className="mt-10 hover:scale-105 transition-transform sticky top-0 z-[300] px-4 py-2 gradient-border after:bg-ternary-section-header bg-opacity-70 backdrop-filter backdrop-blur-sm shadow-sm rounded-[20px]"
              >
                <div className="flex justify-left items-center">
                  {editingSectionId === section.id ? (
                    <AutoResizeInput
                      className="font-bold text-2xl text-text bg-transparent focus:outline-none"
                      value={localSectionName}
                      onChange={handleSectionNameInputChange}
                      onBlur={handleSectionNameInputBlur}
                      onKeyDown={handleSectionNameInputKeyDown}
                      placeholder="Enter section name"
                    />
                  ) : (
                    <h1 className="text-text font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                      {section.name.length > 35 ? (
                        <span title={section.name}>{section.name}</span>
                      ) : (
                        section.name
                      )}
                    </h1>
                  )}
                  {section.name !== "Other" && (
                    <>
                      <button
                        className="ml-5 text-secondary hover:text-dominant"
                        onClick={() =>
                          handleEditSection(section.id, section.name)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 12 12"
                          fill="none"
                          className="cursor-pointer flex-shrink-0 group transition-colors duration-300 ml-5 ease-in-out"
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
                      <button
                        className="ml-3 text-important"
                        onClick={() => handleDeleteSection(section.id)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="ml-3"
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
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-[2vh] py-2 my-2">
                {sectionTasksList.map((task) => (
                  <Task
                    task={task}
                    key={task.id}
                    onTaskClick={() => expandTask(task.id)}
                    minWidth={headerRefs.current[section.id]?.offsetWidth - 150}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionContainer;
