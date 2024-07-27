"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTask } from "../../../../context/TaskContext";

const colors = {
  todo: "bg-white",
  done: "bg-dominant",
  in_progress: "bg-yellow-500",
};

export default function Task({ task, onTaskClick }) {
  const { modifyTask } = useTask();
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskTags, setTaskTags] = useState(() =>
    task.tags.length > 0 ? JSON.parse(task.tags) : []
  );
  const [taskDescription, setTaskDescription] = useState(task.description);

  const taskCircleColor = useMemo(() => colors[taskStatus], [taskStatus]);

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
    setTaskTags(JSON.parse(task.tags));
    setTaskDescription(task.description);
  }, [task]);

  return (
    <div
      onClick={() => onTaskClick(task.id)}
      className="transition-all hover:scale-105 cursor-pointer shadow-2xl rounded-2xl flex flex-col bg-ternary pr-5"
    >
      <div className="flex justify-left items-center py-5">
        <div
          onClick={handleTaskDoneClick}
          className={`z-40 transition-all ${taskCircleColor} cursor-pointer border border-black min-w-[1.5rem] min-h-[1.5rem] rounded-full mx-5`}
        />
        <h3 className="font-bold text-xl px-5 font-inter">{task.title}</h3>
      </div>
      {taskTags.length > 0 && (
        <p className="font-light text-left pb-2 px-5 text-xs">
          {taskDescription}
        </p>
      )}

      {taskTags.length > 0 && (
        <div className="pt-2 pb-2 px-5 w-full flex justify-end">
          {Array.isArray(taskTags) &&
            taskTags &&
            taskTags.length > 0 &&
            taskTags.map((taskTag, index) => (
              <div key={index} className="flex justify-right items-center">
                <div className="border border-black w-2 h-2 rounded-full mx-2" />
                <p className="text-xs text-light">{taskTag.name}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
