"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTask } from "../../../../context/TaskContext";

const statusColors = {
  todo: "bg-primary",
  done: "bg-dominant",
  in_progress: "bg-ternary",
};

export default function Task({ task, onTaskClick, minWidth }) {
  const { modifyTask } = useTask();
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskTags, setTaskTags] = useState([]);
  const [taskDescription, setTaskDescription] = useState(task.description);

  const taskCircleColor = useMemo(() => statusColors[taskStatus], [taskStatus]);

  const handleTaskDoneClick = useCallback(
    (e) => {
      e.stopPropagation();
      const newStatus = taskStatus !== "done" ? "done" : "todo";
      setTaskStatus(newStatus);
      modifyTask({ ...task, status: newStatus }, "post");
    },
    [taskStatus, task, modifyTask]
  );

  useEffect(() => {
    setTaskStatus(task.status);
    setTaskDescription(task.description);
    try {
      const parsedTags = task.tags;
      setTaskTags(Array.isArray(parsedTags) ? parsedTags : []);
    } catch (error) {
      console.error("Error parsing task tags:", error);
      setTaskTags([]);
    }
  }, [task]);
  return (
    <div
      onClick={() => onTaskClick(task.id)}
      style={{ minWidth: minWidth }}
      className={`gradient-border bg-primary transition hover:scale-105 cursor-pointer shadow-shadow_card rounded-2xl flex flex-col`}
    >
      <div className="flex justify-left items-center pt-5 pb-2">
        <div
          onClick={handleTaskDoneClick}
          className={`z-40 transition-all ${taskCircleColor} cursor-pointer gradient-border border border-secondary min-w-[1.5rem] min-h-[1.5rem] rounded-full mx-5`}
        />
        <h3 className="text-text font-bold text-lg 4xl:text-xl px-5 font-inter text-right">
          {task.title}
        </h3>
      </div>
      {taskDescription && taskDescription.length > 0 && (
        <p className="text-text font-light text-left pb-2 px-5 text-xs">
          {taskDescription}
        </p>
      )}
      <div className="pt-2 pb-2 px-5 w-full flex justify-end">
        {taskTags.length > 0 && (
          <div className="flex flex-wrap justify-end">
            {taskTags.map((taskTag, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-1"
              >
                <div className="border border-secondary w-2 h-2 rounded-full mr-1" />
                <p className="text-text text-xs text-light">{taskTag.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
