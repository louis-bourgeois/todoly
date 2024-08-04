"use client";
import { useCallback, useMemo } from "react";
import { useTask } from "../../../../context/TaskContext";

const colors = {
  todo: "bg-primary",
  done: "bg-dominant",
  in_progress: "bg-yellow-500",
};

export default function MobileTask({ task, onClick }) {
  const { modifyTask } = useTask();

  const shortTitle = task.title.length <= 8;
  const tags = useMemo(() => task.tags, [task.tags]);

  const taskCircleColor = useMemo(() => colors[task.status], [task.status]);

  const handleTaskStatusChange = useCallback(
    (e) => {
      e.stopPropagation();
      const newStatus = task.status !== "done" ? "done" : "todo";
      modifyTask({ ...task, status: newStatus }, "post");
    },
    [task, modifyTask]
  );

  return (
    <div
      onClick={() => onClick(task.id)}
      className="overflow-x-clip cursor-pointer flex flex-col justify-center items-start bg-ternary rounded-lg p-3 shadow-md hover:shadow-shadow_card transition-shadow duration-300"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex justify-start items-center">
          <button onClick={handleTaskStatusChange}>
            <div
              className={`z-40 transition-all ${taskCircleColor} cursor-pointer border border-secondary min-w-[1rem] min-h-[1rem] rounded-full mr-2`}
            />
          </button>
          <h5 className="text-sm font-medium text-gray-800 truncate">
            {task.title}
          </h5>
        </div>

        {shortTitle && tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 ml-2">
            {Array.isArray(tags) &&
              tags.length > 0 &&
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mr-1" />
                  <span className="text-2xs text-gray-700">{tag.name}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {task.description && (
        <div className="w-full mt-2">
          <p className="text-2xs text-gray-600">{task.description}</p>
        </div>
      )}

      {!shortTitle && tags.length > 0 && (
        <div className="flex flex-wrap justify-end items-center gap-2 mt-2 w-full">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 rounded-full px-2 py-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mr-1" />
              <span className="text-2xs text-gray-700">{tag.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
