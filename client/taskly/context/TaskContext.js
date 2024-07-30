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

const TaskContext = createContext();
const baseUrl = `${config.apiUrl}/api`;
const socket = io(config.apiUrl);

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { handleError } = useError();
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated } = useAuth();
  const [activeTask, setActiveTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/tasks`, {
        withCredentials: true,
      });
      const formattedTasks = response.data.tasks.map((task) => task);
      console.log(response.data.tasks);
      setTasks(formattedTasks);
    } catch (error) {
      handleError(error);
    }
  }, [isAuthenticated]);

  const addTask = useCallback(
    async (taskData) => {
      try {
        const response = await axios.post(
          `${baseUrl}/tasks/add`,
          { taskData },
          { withCredentials: true }
        );
        console.log(response.data.savedTask);
        if (response.status === 201 && response.data.savedTask) {
          const newTask = response.data.savedTask[0];

          if (newTask && newTask.id) {
            setTasks((prev) => [...prev, newTask]);
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
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task && task.id === updatedTask.id ? updatedTask : task
            )
          );
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
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task && task.id !== taskId)
          );
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
  }, [fetchTasks]);

  useEffect(() => {
    console.log("Tasks state:", tasks);
  }, [tasks]);

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
