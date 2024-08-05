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

const TaskContext = createContext();
const baseUrl = "/api";

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { handleError } = useError();
  const { setWorkspaces } = useWorkspace();
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAuth();
  const [activeTask, setActiveTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data.tasks);
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated, handleError]);

  const addTask = useCallback(
    async (taskData) => {
      const formattedTaskData = {
        ...taskData,
        tags: taskData.tags,
      };
      try {
        const response = await axios.post(
          `${baseUrl}/tasks/add`,
          { formattedTaskData },
          { withCredentials: true }
        );
        if (response.status === 201 && response.data.savedTask) {
          const newTask = response.data.savedTask[0];
          if (newTask && newTask.id) {
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setWorkspaces((prevWorkspaces) => {
              return prevWorkspaces.map((workspace) => {
                if (workspace.id === newTask.workspace_id) {
                  return {
                    ...workspace,
                    tasks: [...workspace.tasks, newTask],
                  };
                }
                return workspace;
              });
            });
          }
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError, setWorkspaces]
  );

  const modifyTask = useCallback(
    async (updatedTask) => {
      try {
        const response = await axios.post(
          `${baseUrl}/tasks/update`,
          { task: updatedTask },
          { withCredentials: true }
        );
        if (response.status === 200) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
          setWorkspaces((prevWorkspaces) => {
            return prevWorkspaces.map((workspace) => {
              if (workspace.id === updatedTask.workspace_id) {
                return {
                  ...workspace,
                  tasks: workspace.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
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
          `${baseUrl}/tasks/delete/${taskId}`,
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
