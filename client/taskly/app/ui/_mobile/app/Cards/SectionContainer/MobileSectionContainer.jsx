import MobileTask from "@/ui/_mobile/task/MobileTask";
import { useCallback, useEffect, useMemo } from "react";
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
  const { tasks, activeTask, setActiveTask } = useTask();
  const { sections, modifySection, deleteSection } = useSection();
  const { preferences } = useUserPreferences();
  const { currentWorkspace } = useWorkspace();
  const { toggleTaskMenu, setCardType } = useMenu();

  const workspace = useMemo(
    () => selectedWorkspace?.id || currentWorkspace,
    [selectedWorkspace, currentWorkspace]
  );

  const expandTask = useCallback(
    (taskId) => {
      console.log(taskId);
      setActiveTask(taskId);
      setCardType("Task");
    },
    [activeTask, setActiveTask, toggleTaskMenu]
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
          (!date || task.due_date === date)
      );
      if (sectionTasksFiltered.length > 0) {
        taskMap.set(section.id, sectionTasksFiltered);
      }
    });
    return taskMap;
  }, [tasks, filteredSections, date, preferences]);

  const allSections = useMemo(() => {
    const sectionsWithTasks = [];
    const sectionsWithoutTasks = [];

    filteredSections.forEach((section, index) => {
      const sectionTasksList = sectionTasks.get(section.id) || [];
      if (sectionTasksList.length > 0) {
        sectionsWithTasks.push({ section, tasks: sectionTasksList, index });
      } else {
        sectionsWithoutTasks.push({ section, tasks: [], index });
      }
    });

    return [...sectionsWithTasks, ...sectionsWithoutTasks];
  }, [filteredSections, sectionTasks, sections]);
  useEffect(() => {
    console.log("Sections changed:", sections);
  }, [sections]);

  useEffect(() => {
    console.log("Tasks changed:", tasks);
  }, [tasks]);

  useEffect(() => {
    console.log("FilteredSections changed:", filteredSections);
  }, [filteredSections]);

  useEffect(() => {
    console.log("SectionTasks changed:", sectionTasks);
  }, [sectionTasks]);

  useEffect(() => {
    console.log("AllSections changed:", allSections);
  }, [allSections]);

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-start gap-[25px]">
      {allSections.map(({ section, tasks }, newIndex) => (
        <div
          key={`${section.id}-${tasks.length}-${tasks
            .map((task) => task.id)
            .join("-")}`}
          className="flex flex-col gap-[12px]"
        >
          <SectionHeader
            index={newIndex}
            section={section}
            onSectionNameChange={modifySection}
            deleteSection={deleteSection}
          />
          <div
            className={`grid grid-cols-2 gap-4 px-[16px] ${
              newIndex === allSections.length - 1 && "mb-[15px]"
            }`}
          >
            {tasks.map((task) => (
              <MobileTask key={task.id} task={task} onClick={expandTask} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
