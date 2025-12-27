import { useCallback, useEffect, useMemo, useState } from "react";
import { useError } from "../../../../../context/ErrorContext";
import { useMenu } from "../../../../../context/MenuContext";
import { useTask } from "../../../../../context/TaskContext";
import DatePicker from "../MenuLayouts/Task/DatePicker";
import PriorityCounter from "../MenuLayouts/Task/PriorityCounter";
import TagManager from "../MenuLayouts/Task/TagManager";
import TaskLayoutDescription from "../MenuLayouts/Task/TaskLayoutDescription";
import TaskLayoutFooter from "../MenuLayouts/Task/TaskLayoutFooter";
import TaskLayoutHeader from "../MenuLayouts/Task/TaskLayoutHeader";
import { defaultRecurrence, normalizeRecurrence } from "@/app/utils/recurrence";
import { useTranslation } from "@/app/i18n/client";
const capitalize = (str) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export default function TaskView({ id }) {
  const { tasks, modifyTask, deleteTask } = useTask();
  const { handleError } = useError();
  const { t } = useTranslation();
  const [lastUrlSegment, setLastUrlSegment] = useState("");
  const [task, setTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkedSection, setLinkedSection] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const { cardType, setCardType } = useMenu();
  const [priority, setPriority] = useState(5);
  const [subtasks, setSubtasks] = useState([]);
  const [recurrence, setRecurrence] = useState(defaultRecurrence);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setTaskTitle(foundTask.title || "");
      setDescription(foundTask.description || "");
      setLinkedSection(foundTask.linked_section || []);
      setWorkspaceId(foundTask.workspace_id || "");
      setStatus(foundTask.status || "");
      setDueDate(foundTask.due_date || null);
      setTags(foundTask.tags || []);
      setPriority(foundTask.priority || 5);
      setSubtasks(foundTask.subtasks || []);
      setRecurrence(normalizeRecurrence(foundTask.recurrence));
    }
  }, [id, tasks]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split("/");
      setLastUrlSegment(segments[segments.length - 1]);
    }
  }, [cardType]);

  const weekDays = useMemo(
    () => [
      { key: "mon", value: 1 },
      { key: "tue", value: 2 },
      { key: "wed", value: 3 },
      { key: "thu", value: 4 },
      { key: "fri", value: 5 },
      { key: "sat", value: 6 },
      { key: "sun", value: 0 },
    ],
    []
  );

  const recurrenceSummary = useMemo(() => {
    const daysLabel = weekDays
      .filter((day) => recurrence.days.includes(day.value))
      .map((day) => t(`recurrence.days.${day.key}`))
      .join(", ");
    switch (recurrence.type) {
      case "daily":
        return t("recurrence.daily");
      case "weekend":
        return t("recurrence.weekend");
      case "custom":
        return daysLabel
          ? `${t("recurrence.custom")}: ${daysLabel}`
          : t("recurrence.customPlaceholder");
      default:
        return t("recurrence.onlyThisTime");
    }
  }, [recurrence, t, weekDays]);

  const persistTaskChanges = useCallback(
    async (changes) => {
      if (!task) return;
      const updatedTask = { ...task, ...changes };
      setTask(updatedTask);
      try {
        await modifyTask(updatedTask);
      } catch (error) {
        handleError(error);
      }
    },
    [task, modifyTask, handleError]
  );

  const handleModifyTask = useCallback(async () => {
    if (task) {
      const updatedTask = {
        ...task,
        title: taskTitle,
        description: description,
        linked_section: linkedSection,
        workspace_id: workspaceId,
        status: status,
        due_date: dueDate,
        tags: tags,
        priority: priority,
        subtasks: subtasks,
        recurrence: recurrence,
      };
      try {
        await modifyTask(updatedTask);
        console.log("Task updated successfully");
        // You can add a notification or success message here
        setCardType(capitalize(lastUrlSegment));
      } catch (error) {
        console.error("Failed to update task", error);
        handleError(error);
      }
    }
  }, [
    lastUrlSegment,
    setCardType,
    task,
    taskTitle,
    description,
    linkedSection,
    workspaceId,
    status,
    dueDate,
    tags,
    priority,
    modifyTask,
    subtasks,
    recurrence,
    handleError,
  ]);

  const handleTagsChange = useCallback((newTags) => {
    setTags(newTags);
  }, []);

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleDeleteTask = useCallback(async () => {
    try {
      if (id) {
        await deleteTask(id);
        setCardType(capitalize(lastUrlSegment));
      } else {
        console.error("id is not defined");
      }
    } catch (error) {
      console.error("Error in handleDeleteTask:", error);
      handleError(error);
    }
  }, [id, lastUrlSegment, setCardType, deleteTask, handleError]);

  const handleAddSubtask = () => {
    const newSubtask = {
      id:
        (typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `subtask-${Date.now()}`) + subtasks.length,
      title: "",
      done: false,
    };
    const updated = [...subtasks, newSubtask];
    setSubtasks(updated);
    persistTaskChanges({ subtasks: updated });
  };

  const handleToggleSubtask = (subtaskId) => {
    const updated = subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, done: !subtask.done } : subtask
    );
    setSubtasks(updated);
    persistTaskChanges({ subtasks: updated });
  };

  const handleSubtaskTitleChange = (subtaskId, value) => {
    const updated = subtasks.map((subtask) =>
      subtask.id === subtaskId ? { ...subtask, title: value } : subtask
    );
    setSubtasks(updated);
  };

  const handleDeleteSubtask = (subtaskId) => {
    const updated = subtasks.filter((subtask) => subtask.id !== subtaskId);
    setSubtasks(updated);
    persistTaskChanges({ subtasks: updated });
  };

  const handleRecurrenceTypeChange = (type) => {
    let next = { ...recurrence, type };
    if (type === "daily") {
      next.days = [0, 1, 2, 3, 4, 5, 6];
    } else if (type === "weekend") {
      next.days = [0, 6];
    } else if (type === "none") {
      next = { type: "none", days: [], endDate: null };
    }
    const normalized = normalizeRecurrence(next);
    setRecurrence(normalized);
    persistTaskChanges({ recurrence: normalized });
  };

  const handleRecurrenceDayToggle = (dayValue) => {
    const days = new Set(recurrence.days);
    if (days.has(dayValue)) {
      days.delete(dayValue);
    } else {
      days.add(dayValue);
    }
    const normalized = normalizeRecurrence({
      ...recurrence,
      type: "custom",
      days: Array.from(days).sort(),
    });
    setRecurrence(normalized);
    persistTaskChanges({ recurrence: normalized });
  };

  const handleRecurrenceEndDate = (value) => {
    const normalized = normalizeRecurrence({ ...recurrence, endDate: value });
    setRecurrence(normalized);
    persistTaskChanges({ recurrence: normalized });
  };

  if (!task) {
    return <div>The requested task is not available at this time</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <TaskLayoutHeader
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          handleTaskClick={handleModifyTask}
          buttonLabel="Update"
          isEditMode={true}
          handleDeleteTask={handleDeleteTask}
          lastUrlSegment={lastUrlSegment}
        />
        <TaskLayoutDescription
          taskDescription={description}
          setTaskDescription={setDescription}
        />
        <div className="flex flex-col gap-2 bg-primary rounded-lg p-3 mt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-text font-semibold">{t("subtasks.title")}</h4>
            <button
              className="text-dominant text-lg font-bold"
              onClick={handleAddSubtask}
              aria-label={t("subtasks.add")}
            >
              +
            </button>
          </div>
          {subtasks.length === 0 && (
            <p className="text-xs text-secondary">{t("subtasks.empty")}</p>
          )}
          <div className="flex flex-col gap-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 bg-primary/80 rounded-lg px-3 py-2 border border-secondary"
              >
                <input
                  type="checkbox"
                  checked={!!subtask.done}
                  onChange={() => handleToggleSubtask(subtask.id)}
                  className="w-4 h-4 accent-dominant"
                  aria-label={t("subtasks.toggle")}
                />
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) =>
                    handleSubtaskTitleChange(subtask.id, e.target.value)
                  }
                  className="flex-1 bg-transparent text-sm text-text focus:outline-none border-b border-secondary"
                  placeholder={t("subtasks.placeholder")}
                />
                <button
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  className="text-important text-xs"
                  aria-label={t("subtasks.delete")}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TagManager
        taskTags={tags}
        setTaskTags={setTags}
        handleTagsChange={handleTagsChange}
      />
      <DatePicker dueDate={dueDate} handleDateChange={handleDateChange} />
      <div className="bg-primary rounded-lg p-3 flex flex-col gap-2 border border-secondary">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-text">
            {t("recurrence.label")}
          </span>
          <select
            value={recurrence.type}
            onChange={(e) => handleRecurrenceTypeChange(e.target.value)}
            className="bg-transparent border border-secondary rounded-md px-2 py-1 text-text text-sm focus:outline-none"
          >
            <option value="none">{t("recurrence.onlyThisTime")}</option>
            <option value="daily">{t("recurrence.daily")}</option>
            <option value="weekend">{t("recurrence.weekend")}</option>
            <option value="custom">{t("recurrence.custom")}</option>
          </select>
        </div>
        {recurrence.type === "custom" && (
          <div className="flex flex-wrap gap-2">
            {weekDays.map((day) => {
              const isActive = recurrence.days.includes(day.value);
              return (
                <button
                  key={day.key}
                  onClick={() => handleRecurrenceDayToggle(day.value)}
                  className={`px-2 py-1 rounded-full border text-xs transition ${
                    isActive
                      ? "bg-dominant text-primary border-dominant"
                      : "border-secondary text-text"
                  }`}
                >
                  {t(`recurrence.days.${day.key}`)}
                </button>
              );
            })}
          </div>
        )}
        <label className="flex flex-col text-xs text-secondary gap-1">
          {t("recurrence.endDate")}
          <input
            type="date"
            value={recurrence.endDate || ""}
            onChange={(e) => handleRecurrenceEndDate(e.target.value)}
            className="bg-transparent border border-secondary rounded-md px-2 py-1 text-text focus:outline-none"
          />
        </label>
        <p className="text-xs text-secondary">{recurrenceSummary}</p>
      </div>
      <PriorityCounter priority={priority} setPriority={setPriority} />
      <TaskLayoutFooter
        status={status}
        setStatus={setStatus}
        selectedSection={linkedSection[0] || ""}
        setSelectedSection={(sectionId) => setLinkedSection([sectionId])}
        selectedWorkspace={workspaceId}
        setSelectedWorkspace={setWorkspaceId}
      />
    </>
  );
}
