import MobileTask from "@/ui/_mobile/task/MobileTask";
import { useCallback, useMemo } from "react";
import { useMenu } from "../../../../../../context/MenuContext";
import { useSection } from "../../../../../../context/SectionContext";
import { useTask } from "../../../../../../context/TaskContext";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import SectionHeader from "./SectionHeader";

export default function MobileSectionContainer({
  date,
  selectedWorkspace = undefined,
}) {
  const { tasks, setActiveTask } = useTask();
  const { sections, modifySection, deleteSection } = useSection();
  const { preferences } = useUserPreferences();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { setCardType } = useMenu();

  const workspace = selectedWorkspace?.id || currentWorkspace;

  const expandTask = useCallback(
    (taskId) => {
      console.log(taskId);
      const foundTask = tasks.find((task) => task.id === taskId);
      console.log("fdddd", foundTask, tasks);
      setCurrentWorkspace(foundTask.workspace_id);
      setCardType("Task");
      setActiveTask(taskId);
    },
    [setCardType, tasks, setCurrentWorkspace, setActiveTask]
  );

  const filteredSections = useMemo(
    () =>
      sections
        .filter((section) => section.workspace_id === workspace)
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          return 0;
        }),
    [sections, workspace]
  );

  const sectionTasks = useMemo(() => {
    const taskMap = new Map();
    let allTasks = [...tasks];

    // Sort tasks
    switch (preferences.Sort_By) {
      case "Creation date":
        allTasks.sort(
          (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
        );
        break;
      case "Tags":
        // TODO: Implement here
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
    }

    filteredSections.forEach((section) => {
      const sectionTasksFiltered = allTasks.filter(
        (task) =>
          task &&
          task.linked_section === section.id &&
          (selectedWorkspace || task.due_date === date)
      );
      if (sectionTasksFiltered.length > 0) {
        taskMap.set(section.id, sectionTasksFiltered);
      }
    });
    return taskMap;
  }, [tasks, filteredSections, date, preferences, selectedWorkspace]);

  const sectionsWithTasks = useMemo(() => {
    return filteredSections.filter((section) => sectionTasks.has(section.id));
  }, [filteredSections, sectionTasks]);

  return (
    <div className="w-full h-full overflow-y-auto  flex flex-col justify-start gap-[25px]">
      {sectionsWithTasks.map((section, index) => (
        <div
          key={`${section.id}-${
            sectionTasks.get(section.id).length
          }-${sectionTasks
            .get(section.id)
            .map((task) => task.id)
            .join("-")}`}
          className="flex flex-col gap-[12px]"
        >
          <SectionHeader
            index={index}
            section={section}
            onSectionNameChange={modifySection}
            deleteSection={deleteSection}
          />
          <div
            className={`grid grid-cols-2 gap-4 px-[16px] ${
              index === sectionsWithTasks.length - 1 && "mb-[15px]"
            }`}
          >
            {sectionTasks.get(section.id).map((task) => (
              <MobileTask
                key={task.id}
                task={task}
                onClick={() => expandTask(task.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
