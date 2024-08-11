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
  const { sections, deleteSection } = useSection();
  const { handleError } = useError();
  const { preferences } = useUserPreferences();
  const { currentWorkspace } = useWorkspace();
  const { toggleTaskMenu } = useMenu();
  const [sectionTasks, setSectionsTasks] = useState(new Map());
  const [workspace, setWorkspace] = useState(currentWorkspace);
  const headerRefs = useRef({});

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
      Tags: () => 0, // TODO: Implement sorting by tags
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
      // Force a re-render to update the minWidth of tasks
      setSectionsTasks(new Map(sectionTasks));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sectionTasks]);

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
                  <h1 className="text-text font-bold text-2xl whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                    {section.name.length > 35 ? (
                      <span title={section.name}>{section.name}</span>
                    ) : (
                      section.name
                    )}
                  </h1>
                  {section.name !== "Other" && (
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-5"
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
