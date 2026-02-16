"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTask } from "../../../../context/TaskContext";
import { toFormattedHtml } from "@/app/utils/text";
import { useTranslation } from "../../../i18n/client";

const statusColors = {
  todo: "bg-primary",
  done: "bg-dominant",
  in_progress: "bg-ternary",
};

export default function Task({ task, onTaskClick, minWidth }) {
  const { t } = useTranslation();
  const { modifyTask } = useTask();
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [taskTags, setTaskTags] = useState([]);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const safeMinWidth = Number.isFinite(minWidth) ? minWidth : 180;

  const taskCircleColor = useMemo(() => statusColors[taskStatus], [taskStatus]);
  const isRecurring = useMemo(
    () => task?.recurrence && task.recurrence.type !== "none",
    [task?.recurrence]
  );

  const mixColor = useCallback((a, b, weight) => {
    const clamp = (v) => Math.min(255, Math.max(0, v));
    return [
      clamp(a[0] * (1 - weight) + b[0] * weight),
      clamp(a[1] * (1 - weight) + b[1] * weight),
      clamp(a[2] * (1 - weight) + b[2] * weight),
    ];
  }, []);

  const recurringGradient = useMemo(() => {
    if (!isRecurring) return null;
    const score = Number(task?.recurrence_consistency ?? 0);
    const warm = [251, 113, 133];
    const amber = [249, 115, 22];
    const cool = [37, 99, 235];
    const lightCool = [59, 130, 246];
    const startColor = mixColor(warm, amber, Math.min(1, 0.6 - score * 0.2));
    const endColor = mixColor(lightCool, cool, Math.min(1, 0.5 + score * 0.4));
    const startAlpha = 0.25 + score * 0.15;
    const endAlpha = 0.45 + score * 0.25;
    return `linear-gradient(135deg, rgba(${startColor
      .map((c) => Math.round(c))
      .join(",")},${startAlpha.toFixed(2)}) 0%, rgba(${endColor
      .map((c) => Math.round(c))
      .join(",")},${endAlpha.toFixed(2)}) 100%)`;
  }, [isRecurring, task?.recurrence_consistency, mixColor]);
  const cardStyle = useMemo(
    () => ({
      minWidth: safeMinWidth,
      ...(recurringGradient ? { backgroundImage: recurringGradient } : {}),
    }),
    [safeMinWidth, recurringGradient]
  );

  const handleTaskDoneClick = useCallback(
    (e) => {
      e.stopPropagation();
      console.log()
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
      style={cardStyle}
      className={` bg-primary transition hover:scale-105 cursor-pointer shadow-shadow_card rounded-2xl flex flex-col gradient-border z-[0]`}
    >
      <div className="flex justify-left items-center pt-5 pb-2">
        <div
          onClick={handleTaskDoneClick}
          className={`z-40 transition-all ${taskCircleColor} cursor-pointer border border-secondary min-w-[1.5rem] min-h-[1.5rem] rounded-full mx-5`}
        />
        <div className="flex flex-col gap-1 px-5">
          <h3 className="text-text font-bold text-lg 4xl:text-xl font-inter text-right">
            {task.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            {task.is_overdue && (
              <span className="text-xs px-3 py-1 rounded-full bg-important/10 text-important border border-important/40 uppercase tracking-wide">
                {t("task.overdueFlag")}
              </span>
            )}
            {isRecurring && (
              <span className="text-[10px] px-2 py-1 rounded-full bg-primary/50 text-text border border-white/10 backdrop-blur-sm">
                {t("task.regularity")}{" "}
                {Math.round((task?.recurrence_consistency || 0) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
      {taskDescription && taskDescription.length > 0 && (
        <p
          className="text-text font-light text-left pb-2 px-5 text-xs"
          dangerouslySetInnerHTML={{ __html: toFormattedHtml(taskDescription) }}
        />
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
