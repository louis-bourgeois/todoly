"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../../../context/UserContext";

export default function Task({ task, onTaskClick }) {
  const { modifyTask, user } = useUser();
  const colors = {
    todo: "bg-white",
    done: "bg-blue",
    in_progress: "bg-yellow-500",
  };
  const [taskCircleColor, setTaskCircleColor] = useState(colors[task.status]);
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskTags, setTaskTags] = useState(JSON.parse(task.tags));
  const [taskDescription, setTaskDescription] = useState(task.description);

  useEffect(() => {
    setTaskCircleColor(colors[taskStatus]);
    task.status = taskStatus;

    modifyTask(task, user, "post");
  }, [taskStatus]);

  useEffect(() => {
    setTaskTags(JSON.parse(task.tags));
    setTaskDescription(task.description);
  }, [task]);

  const handleTaskDoneClick = () => {
    setTaskStatus(taskStatus !== "done" ? "done" : "todo");
  };

  return (
    <div
      onClick={() => onTaskClick(task.id)}
      className="transition-all hover:scale-105 cursor-pointer shadow-2xl rounded-2xl flex w-[325px] flex-col"
    >
      <div className="flex justify-left items-center py-5">
        <div
          onClick={handleTaskDoneClick}
          className={`z-40 transition-all ${taskCircleColor} cursor-pointer border border-black min-w-[1.5rem] min-h-[1.5rem] rounded-full mx-5`}
        ></div>
        <h3 className="font-bold text-3xl px-5 font-inter">{task.title}</h3>
      </div>
      <p className="font-light text-left pb-2 px-5 text-s">{taskDescription}</p>
      <div className="pt-2 pb-2 px-5 w-full flex justify-end">
        {taskTags.map((taskTag, index) => {
          return (
            <div key={index} className="flex justify-right items-center">
              <div className="border border-black w-2 h-2 rounded-full mx-2"></div>
              <p className="text-xs text-light">{taskTag.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
