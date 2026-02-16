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

export default function Task({ task, onTaskClick, minWidth, viewDate }) {
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

  const recurrenceVisual = useMemo(() => {
    if (!isRecurring) return null;
    const score = Math.max(0, Math.min(1, Number(task?.recurrence_consistency ?? 0)));
    const accent =
      score < 0.34 ? [250, 55, 102] : score < 0.67 ? [255, 159, 10] : [0, 122, 255];
    const accentRGB = accent.join(",");
    return {
      gradient: `linear-gradient(135deg, rgba(${accentRGB},0.22) 0%, rgba(${accentRGB},0.08) 100%)`,
      border: `rgba(${accentRGB},0.75)`,
      ring: `rgba(${accentRGB},0.32)`,
      badgeBg: `rgba(${accentRGB},0.14)`,
      badgeText: `rgb(${accentRGB})`,
    };
  }, [isRecurring, task?.recurrence_consistency]);

  const recurrenceBadgeStyle = useMemo(
    () =>
      recurrenceVisual
        ? {
            backgroundColor: recurrenceVisual.badgeBg,
            borderColor: recurrenceVisual.border,
            color: recurrenceVisual.badgeText,
          }
        : undefined,
    [recurrenceVisual]
  );

  const cardStyle = useMemo(
    () => ({
      minWidth: safeMinWidth,
      ...(recurrenceVisual
        ? {
            backgroundImage: recurrenceVisual.gradient,
            outline: `1px solid ${recurrenceVisual.border}`,
            outlineOffset: "-1px",
            boxShadow: `0 10px 24px rgba(0,0,0,0.18), 0 0 0 1px ${recurrenceVisual.ring} inset`,
          }
        : {}),
    }),
    [safeMinWidth, recurrenceVisual]
  );

  const handleTaskDoneClick = useCallback(
    (e) => {
      e.stopPropagation();
      console.log()
      const newStatus = taskStatus !== "done" ? "done" : "todo";
      setTaskStatus(newStatus);
      const now = new Date();
      const fallbackDate = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const completionContextDate =
        typeof viewDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(viewDate)
          ? viewDate
          : fallbackDate;

      modifyTask(
        { ...task, status: newStatus, completion_context_date: completionContextDate },
        "post"
      );
    },
    [taskStatus, task, modifyTask, viewDate]
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
              <span
                className="text-[10px] px-2 py-1 rounded-full border backdrop-blur-sm font-semibold"
                style={recurrenceBadgeStyle}
              >
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
