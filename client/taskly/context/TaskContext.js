"use client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { useError } from "./ErrorContext";
import { useWorkspace } from "./WorkspaceContext";
import { normalizeRecurrence } from "@/app/utils/recurrence";

const TaskContext = createContext();
const baseUrl = "/api/tasks";

export const useTask = () => useContext(TaskContext);

const normalizeSubtasks = (subtasks = []) => {
  if (!Array.isArray(subtasks)) return [];
  return subtasks.map((subtask, index) => {
    const fallbackId =
      subtask?.id ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `subtask-${Date.now()}-${index}`);
    return {
      id: fallbackId,
      title: subtask?.title || subtask?.name || "",
      done:
        typeof subtask?.done === "boolean"
          ? subtask.done
          : !!subtask?.completed || subtask?.status === "done",
    };
  });
};

const computeRecurringConsistency = (task) => {
  const recurrence = normalizeRecurrence(task?.recurrence);
  if (!recurrence || recurrence.type === "none") return null;
  const completions = Number(task?.completion_count || 0);
  const reschedules = Number(task?.reschedule_count || 0);
  const denominator = completions + reschedules || 1;
  return Math.max(0, Math.min(1, completions / denominator));
};

const normalizeTask = (task = {}) => {
  const recurrence = normalizeRecurrence(task.recurrence);
  const isOverdue =
    typeof task.is_overdue === "boolean"
      ? task.is_overdue
      : !!task?.isOverdue;
  const rescheduleCount = Number(task.reschedule_count || 0);
  const completionCount = Number(task.completion_count || 0);
  const autoRescheduleLimit =
    task.auto_reschedule_limit !== undefined
      ? task.auto_reschedule_limit
      : null;
  return {
    ...task,
    tags: Array.isArray(task.tags) ? task.tags : [],
    subtasks: normalizeSubtasks(task.subtasks),
    recurrence,
    is_overdue: isOverdue,
    reschedule_count: rescheduleCount,
    completion_count: completionCount,
    auto_reschedule_limit: autoRescheduleLimit,
    auto_reschedule_enabled:
      task.auto_reschedule_enabled !== undefined
        ? !!task.auto_reschedule_enabled
        : true,
    recurrence_consistency: computeRecurringConsistency({
      ...task,
      recurrence,
      reschedule_count: rescheduleCount,
      completion_count: completionCount,
    }),
  };
};

export const TaskProvider = ({ children }) => {
  const { handleError } = useError();
  const { setWorkspaces } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAuth();
  const [activeTask, setActiveTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}`, {
        withCredentials: true,
      });
      const fetchedTasks = Array.isArray(response.data.tasks)
        ? response.data.tasks.map((task) => normalizeTask(task))
        : [];
      setTasks(fetchedTasks);
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated, handleError]);

  const addTask = useCallback(
    async (taskData) => {
      const formattedTaskData = {
        ...taskData,
        tags: taskData.tags,
        subtasks: normalizeSubtasks(taskData.subtasks),
        recurrence: normalizeRecurrence(taskData.recurrence),
      };
      try {
        const response = await axios.post(
          `${baseUrl}/add`,
          { formattedTaskData },
          { withCredentials: true }
        );
        if (response.status === 201 && response.data.savedTask) {
          const createdTask = response.data.savedTask?.[0];
          const newTaskRaw = createdTask
            ? {
                ...createdTask,
                subtasks:
                  createdTask.subtasks ?? formattedTaskData.subtasks ?? [],
              }
            : { ...formattedTaskData };
          const newTask = normalizeTask(newTaskRaw);
          if (newTask && newTask.id) {
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setWorkspaces((prevWorkspaces) => {
              return prevWorkspaces.map((workspace) => {
                const workspaceTasks = Array.isArray(workspace.tasks)
                  ? workspace.tasks
                  : [];
                if (workspace.id === newTask.workspace_id) {
                  return {
                    ...workspace,
                    tasks: [...workspaceTasks, newTask],
                  };
                }
                return workspace;
              });
            });
          } else {
            fetchTasks();
          }
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError, setWorkspaces, fetchTasks]
  );

  const modifyTask = useCallback(
    async (updatedTask) => {
      const existingTask = tasks.find((t) => t.id === updatedTask.id);
      const payload = { ...updatedTask };
      if (
        payload.status === "done" &&
        existingTask &&
        existingTask.status !== "done"
      ) {
        payload.last_completed_at = new Date().toISOString();
        payload.completion_count = (existingTask.completion_count || 0) + 1;
        payload.is_overdue = false;
      }
      try {
        const response = await axios.post(
          `${baseUrl}/update`,
          { task: payload },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id
                ? normalizeTask({ ...task, ...payload })
                : task
            )
          );
          setWorkspaces((prevWorkspaces) => {
            return prevWorkspaces.map((workspace) => {
              const workspaceTasks = Array.isArray(workspace.tasks)
                ? workspace.tasks
                : [];
              const hasTask = workspaceTasks.some(
                (task) => task.id === updatedTask.id
              );
              const normalized = normalizeTask({
                ...workspaceTasks.find((t) => t.id === updatedTask.id),
                ...payload,
              });
              if (workspace.id === normalized.workspace_id) {
                const nextTasks = hasTask
                  ? workspaceTasks.map((task) =>
                      task.id === updatedTask.id ? normalized : task
                    )
                  : [...workspaceTasks, normalized];
                return {
                  ...workspace,
                  tasks: nextTasks,
                };
              } else if (hasTask) {
                return {
                  ...workspace,
                  tasks: workspaceTasks.filter(
                    (task) => task.id !== updatedTask.id
                  ),
                };
              }
              return workspace;
            });
          });
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError, setWorkspaces, tasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        const response = await axios.delete(
          `${baseUrl}/delete/${taskId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== taskId)
          );
          setWorkspaces((prevWorkspaces) => {
            return prevWorkspaces.map((workspace) => ({
              ...workspace,
              tasks: workspace.tasks.filter((task) => task.id !== taskId),
            }));
          });
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError, setWorkspaces]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        modifyTask,
        deleteTask,
        activeTask,
        setActiveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
