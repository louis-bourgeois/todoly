"use client";

import { useMemo, useRef } from "react";
import { useTask } from "../../../../../context/TaskContext";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";
import { useTranslation } from "../../../../i18n/client";

const createId = (fallback) => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return fallback;
};

export default function SubtaskList({
  id,
  task,
  setTask,
  subtasks,
  setSubtasks,
}) {
  const { modifyTask } = useTask();
  const { t } = useTranslation();
  const lastInputRef = useRef(null);

  const handlePersist = async (nextSubtasks) => {
    setSubtasks(nextSubtasks);
    if (id && task) {
      const updatedTask = {
        ...task,
        subtasks: nextSubtasks,
        workspace_id: task.workspace_id,
      };
      setTask(updatedTask);
      try {
        await modifyTask(updatedTask);
      } catch (error) {
        console.error("Failed to update subtasks", error);
      }
    }
  };

  const handleAddSubtask = () => {
    const newSubtask = {
      id: createId(`subtask-${Date.now()}`),
      title: "",
      done: false,
    };
    handlePersist([...(subtasks || []), newSubtask]);
    setTimeout(() => lastInputRef.current?.focus(), 0);
  };

  const handleToggle = (subtaskId) => {
    const nextSubtasks = subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask
    );
    handlePersist(nextSubtasks);
  };

  const handleDelete = (subtaskId) => {
    const nextSubtasks = subtasks.filter((subtask) => subtask.id !== subtaskId);
    handlePersist(nextSubtasks);
  };

  const handleTitleChange = (subtaskId, value) => {
    const nextSubtasks = subtasks.map((subtask, index) => {
      if (subtask.id === subtaskId) {
        return { ...subtask, title: value };
      }
      return subtask;
    });
    setSubtasks(nextSubtasks);
  };

  const sortedSubtasks = useMemo(
    () => [...(subtasks || [])].sort((a, b) => Number(a.done) - Number(b.done)),
    [subtasks]
  );

  return (
    <TaskMenuSectionContainer
      flexCol
      moreRoundedCorners="bl"
      othersStyles="justify-between h-full"
    >
      <div className="flex justify-between items-center m-[1%]">
        <h2 className="p-[3%] font-bold text-2xl text-text select-none">
          {t("subtasks.title")}
        </h2>
        <button
          className="justify-center items-center font-bold hover:scale-105 transition-transform active:scale-100 text-dominant"
          onClick={handleAddSubtask}
          aria-label={t("subtasks.add")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="flex justify-center items-center"
            aria-hidden="true"
            fill="currentColor"
            width="48"
          >
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm4-9H13V8a1,1,0,0,0-2,0v3H8a1,1,0,0,0,0,2h3v3a1,1,0,0,0,2,0V13h3a1,1,0,0,0,0-2Z"></path>
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto pr-1 h-full max-h-[420px]">
        {sortedSubtasks.length === 0 && (
          <p className="text-text text-sm opacity-70 px-2 pb-2">
            {t("subtasks.empty")}
          </p>
        )}
        {sortedSubtasks.map((subtask, index) => (
          <div
            key={subtask.id}
            className="flex items-center gap-3 gradient-border rounded-[16px] px-3 py-2 bg-primary/40"
          >
            <button
              onClick={() => handleToggle(subtask.id)}
              className={`w-6 h-6 flex items-center justify-center rounded-full border-2 transition-all ${
                subtask.done
                  ? "bg-dominant border-dominant"
                  : "border-secondary"
              }`}
              aria-label={t("subtasks.toggle")}
            >
              {subtask.done && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="w-4 h-4 text-primary"
                >
                  <path
                    d="M4.5 10.5 8 14l7.5-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <input
              ref={index === sortedSubtasks.length - 1 ? lastInputRef : null}
              type="text"
              value={subtask.title}
              onChange={(e) => handleTitleChange(subtask.id, e.target.value)}
              onBlur={() => handlePersist(sortedSubtasks)}
              className={`flex-1 bg-transparent text-text text-base focus:outline-none ${
                subtask.done ? "line-through opacity-60" : ""
              }`}
              placeholder={t("subtasks.placeholder")}
            />
            <button
              onClick={() => handleDelete(subtask.id)}
              className="text-important hover:scale-105 transition-transform"
              aria-label={t("subtasks.delete")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </TaskMenuSectionContainer>
  );
}
