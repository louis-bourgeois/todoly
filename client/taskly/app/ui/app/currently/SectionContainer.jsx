"use client";
import Task from "@/ui/app/Task/Task";
import { useContext, useEffect, useState } from "react";
import { MenuContext } from "../../../../context/MenuContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";

export default function SectionContainer({ date }) {
  const { user, tasks, loading } = useUser();
  const { currentWorkspace } = useWorkspace();
  const { activeTask, setActiveTask } = useTask();
  const [sections, setSections] = useState([]);
  const { toggleTaskMenu } = useContext(MenuContext);

  useEffect(() => {
    if (!loading && user) {
      setSections(user.sections || []);
    }
  }, [user, loading]);

  const expandTask = (taskId) => {
    if (taskId !== activeTask) {
      setActiveTask(taskId);
    }
    toggleTaskMenu();
  };
  console.log(
    sections.filter((section) => section.workspace_id === currentWorkspace)
  );
  return (
    <div className="w-full h-[80%] flex">
      {Array.isArray(sections) &&
        sections
          .filter((section) => section.workspace_id === currentWorkspace)
          .map((section) => {
            const tasksForSectionAndDate = tasks.filter(
              (task) =>
                task &&
                task.due_date &&
                task.linked_section === section.id &&
                task.due_date === date
            );

            if (tasksForSectionAndDate.length === 0) return null;

            return (
              <div
                key={section.id}
                className="flex flex-col h-[96%] items-start justify-start p-10 gap-8 overflow-x-scroll scroll-hide"
              >
                <h1 className="font-bold text-4xl">{section.name}</h1>
                {tasksForSectionAndDate.length > 0 ? (
                  tasksForSectionAndDate.map((task) => (
                    <Task
                      task={task}
                      key={task.id}
                      onTaskClick={() => expandTask(task.id)}
                    />
                  ))
                ) : (
                  <p>You do not have any task due for this date</p>
                )}
              </div>
            );
          })}
    </div>
  );
}
