"use client";
import Task from "@/ui/app/Task/Task";
import { useEffect, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";

export default function SectionContainer({
  date = undefined,
  selectedWorkspace = undefined,
}) {
  const { tasks, sections } = useUser();
  const { currentWorkspace } = useWorkspace();
  const { activeTask, setActiveTask } = useTask();
  const { toggleTaskMenu } = useMenu();
  const [workspace, setWorkspace] = useState(currentWorkspace);

  const expandTask = (taskId) => {
    if (taskId !== activeTask) {
      setActiveTask(taskId);
    }
    toggleTaskMenu();
  };
  useEffect(() => {
    console.log("====================================");
    console.log("sections updated", sections);
    console.log("====================================");
  }, [sections]);
  useEffect(() => {
    console.log("====================================");
    console.log("tasks updated", tasks);
    console.log("====================================");
  }, [tasks]);
  useEffect(() => {
    setWorkspace(selectedWorkspace?.id || currentWorkspace);
  }, [currentWorkspace, selectedWorkspace]);

  return (
    <div className="w-full h-[87.5%] overflow-x-auto">
      <div className="flex h-full">
        {Array.isArray(sections) &&
          sections
            .filter((section) => section.workspace_id === workspace)
            .map((section) => {
              const tasksForSectionAndDate = tasks.filter(
                (task) =>
                  task &&
                  task.due_date &&
                  task.linked_section === section.id &&
                  task.due_date === date
              );
              const tasksForSection = tasks.filter(
                (task) => task && task.linked_section === section.id
              );

              if (tasksForSection.length === 0) return null;
              if (date && tasksForSectionAndDate.length === 0) return null;

              const taskToMap = date ? tasksForSectionAndDate : tasksForSection;
              return (
                <div
                  key={section.id}
                  className="flex flex-col h-full p-10 py-0 gap-[25px]"
                >
                  <div className="sticky top-0 z-[300] pb-4 bg-white bg-opacity-70 backdrop-filter backdrop-blur-sm border-b border-gray-200 shadow-sm rounded-[20px]  mt-2 p-5 ">
                    <div className="flex justify-between items-center w-full">
                      <h1 className="font-bold text-4xl">{section.name}</h1>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[2vh]">
                    {taskToMap.length > 0 ? (
                      taskToMap.map((task) => (
                        <Task
                          task={task}
                          key={task.id}
                          onTaskClick={() => expandTask(task.id)}
                        />
                      ))
                    ) : (
                      <p>You do not have any tasks due for this date</p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
