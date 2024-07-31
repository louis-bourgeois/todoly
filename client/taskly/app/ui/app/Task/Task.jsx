"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTask } from "../../../../context/TaskContext";

const statusColors = {
  todo: "bg-white",
  done: "bg-dominant",
  in_progress: "bg-CTA_bg",
};

const priorityColors = {
  1: "bg-ternary",
  2: "bg-pink bg-opacity-10",
  3: "bg-pink bg-opacity-20",
  4: "bg-pink bg-opacity-30",
  5: "bg-white",
  6: "bg-purple bg-opacity-10",
  7: "bg-purple bg-opacity-20",
  8: "bg-purple bg-opacity-30",
  9: "bg-important bg-opacity-10",
  10: "bg-important bg-opacity-20",
};

export default function Task({ task, onTaskClick }) {
  const { modifyTask } = useTask();
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskTags, setTaskTags] = useState([]);
  const [taskDescription, setTaskDescription] = useState(task.description);

  const taskCircleColor = useMemo(() => statusColors[taskStatus], [taskStatus]);

  const taskBackgroundColor = useMemo(() => {
    const priority = Number(task.priority);
    if (isNaN(priority) || priority < 1) return priorityColors[5];
    if (priority > 10) return priorityColors[10];
    return priorityColors[priority];
  }, [task.priority]);

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
      const parsedTags = JSON.parse(task.tags);
      setTaskTags(Array.isArray(parsedTags) ? parsedTags : []);
    } catch (error) {
      console.error("Error parsing task tags:", error);
      setTaskTags([]);
    }
  }, [task]);

  return (
    <div
      onClick={() => onTaskClick(task.id)}
      className={`transition-all hover:scale-105 cursor-pointer shadow-shadow_card rounded-2xl flex flex-col pr-5 ${taskBackgroundColor}`}
    >
      <div className="flex justify-left items-center py-5">
        <div
          onClick={handleTaskDoneClick}
          className={`z-40 transition-all ${taskCircleColor} cursor-pointer border border-black min-w-[1.5rem] min-h-[1.5rem] rounded-full mx-5`}
        />
        <h3 className="font-bold text-xl px-5 font-inter">{task.title}</h3>
      </div>
      {taskDescription && taskDescription.length > 0 && (
        <p className="font-light text-left pb-2 px-5 text-xs">
          {taskDescription}
        </p>
      )}
      <div className="pt-2 pb-2 px-5 w-full flex justify-end">
        {taskTags.length > 0 && (
          <div className="flex flex-wrap justify-end">
            {taskTags.map((taskTag, index) => (
              <div key={index} className="flex items-center mr-2 mb-1">
                <div className="border border-black w-2 h-2 rounded-full mr-1" />
                <p className="text-xs text-light">{taskTag.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
