"use client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

import { config } from "../config";
import { useAuth } from "./AuthContext";
import { useError } from "./ErrorContext";
import { useWorkspace } from "./WorkspaceContext";

const TaskContext = createContext();
const baseUrl = `${config.apiUrl}/api`;
const socket = io(config.apiUrl);

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
            // Ne mettez pas à jour l'état ici, laissez le socket event handler s'en charger
            socket.emit("taskAdded", newTask);
          }
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
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
          // Ne mettez pas à jour l'état ici, laissez le socket event handler s'en charger
          socket.emit("taskUpdated", updatedTask);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
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
          // Ne mettez pas à jour l'état ici, laissez le socket event handler s'en charger
          socket.emit("taskDeleted", taskId);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [handleError]
  );

  useEffect(() => {
    fetchTasks();

    const handleTaskAdded = (newTask) => {
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
    };

    const handleTaskUpdated = (updatedTask) => {
      if (updatedTask && updatedTask.id) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task && task.id === updatedTask.id ? updatedTask : task
          )
        );
      }
    };

    const handleTaskDeleted = (taskId) => {
      if (taskId) {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task && task.id !== taskId)
        );
      }
    };

    socket.on("taskAdded", handleTaskAdded);
    socket.on("taskUpdated", handleTaskUpdated);
    socket.on("taskDeleted", handleTaskDeleted);

    return () => {
      socket.off("taskAdded", handleTaskAdded);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
    };
  }, [fetchTasks, setWorkspaces]);

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
