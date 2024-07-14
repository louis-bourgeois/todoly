"use client";
import Task from "@/ui/app/Task/Task";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
import { useSection } from "../../../../context/SectionContext";
import { useTask } from "../../../../context/TaskContext";
import { useUserPreferences } from "../../../../context/UserPreferencesContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";

export default function SectionContainer({
  date = undefined,
  selectedWorkspace = undefined,
}) {
  const { tasks, activeTask, setActiveTask } = useTask();
  const { sections } = useSection();
  const { preferences } = useUserPreferences();
  const { currentWorkspace } = useWorkspace();
  const { toggleTaskMenu } = useMenu();
  const [sectionTasks, setSectionsTask] = useState(new Map());
  const [workspace, setWorkspace] = useState(currentWorkspace);

  useEffect(() => {
    setWorkspace(selectedWorkspace?.id || currentWorkspace);
  }, [currentWorkspace, selectedWorkspace]);

  const expandTask = useCallback(
    (taskId) => {
      if (taskId !== activeTask) {
        setActiveTask(taskId);
      }
      toggleTaskMenu();
    },
    [activeTask, setActiveTask, toggleTaskMenu]
  );

  const filteredSections = useMemo(
    () => sections.filter((section) => section.workspace_id === workspace),
    [sections, workspace]
  );

  useEffect(() => {
    console.log("Filtered sections:", filteredSections);
    const taskMap = new Map();
    let allTasks = tasks;

    // Sort tasks
    switch (preferences.Sort_By) {
      case "Creation date":
        allTasks.sort(
          (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
        );
        break;
      case "Tags":
        // TODO / Implement here
        break;
      case "Importance":
        allTasks.sort((a, b) => b.priority - a.priority);
        break;
      case "Last updated":
        allTasks.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        break;
    }

    // Filter tasks
    switch (preferences.Show) {
      case "Completed only":
        allTasks = allTasks.filter((task) => task.status === "done");
        break;
      case "Todo only":
        allTasks = allTasks.filter((task) => task.status !== "done");
        break;
      // 'All tasks' doesn't need filtering
    }

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
    setSectionsTask(new Map(taskMap));
  }, [tasks, filteredSections, date, preferences]);

  useEffect(() => {
    console.log("Tasks or sections updated", tasks, sections);
  }, [tasks, sections]);

  return (
    <div className="w-full h-[87.5%] overflow-x-auto">
      <div className="flex h-full">
        {filteredSections.map((section) => {
          const sectionTasksList = sectionTasks.get(section.id) || [];

          if (sectionTasksList.length === 0) return null;

          return (
            <div
              key={`${section.id}-${tasks.length}-${tasks
                .map((task) => task.id)
                .join("-")}`} // Utiliser une clé unique pour forcer le re-rendu
              className="flex flex-col h-full p-10 py-0 gap-[25px]"
            >
              <div className="sticky top-0 z-[300] pb-4 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm border-b border-gray-200 shadow-sm rounded-[20px] mt-2 p-5">
                <div className="flex justify-between items-center w-full">
                  <h1 className="font-bold text-4xl">{section.name}</h1>
                </div>
              </div>
              <div className="flex flex-col gap-[2vh]">
                {sectionTasksList.map((task) => (
                  <Task
                    task={task}
                    key={task.id}
                    onTaskClick={() => expandTask(task.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
