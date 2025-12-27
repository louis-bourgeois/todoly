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

const normalizeTask = (task = {}) => ({
  ...task,
  tags: Array.isArray(task.tags) ? task.tags : [],
  subtasks: normalizeSubtasks(task.subtasks),
  recurrence: normalizeRecurrence(task.recurrence),
});

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
      try {
        const response = await axios.post(
          `${baseUrl}/update`,
          { task: updatedTask },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id
                ? normalizeTask({ ...task, ...updatedTask })
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
                ...updatedTask,
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
    [handleError, setWorkspaces]
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
