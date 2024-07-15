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
import { useAuth } from "./AuthContext";

const TaskContext = createContext();
const baseUrl = "http://localhost:3001/api";
const socket = io("http://localhost:3001");

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { isAuthenticated, checkAuth } = useAuth();
  const [activeTask, setActiveTask] = useState(null);
  const fetchTasks = useCallback(async () => {

    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [isAuthenticated]);

  const addTask = useCallback(async (taskData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/tasks/add`,
        { taskData },
        { withCredentials: true }
      );
      if (response.status === 201 && response.data.savedTask) {
        setTasks((prev) => [...prev, response.data.savedTask[0]]);
        socket.emit("taskAdded", response.data.savedTask);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }, []);

  const modifyTask = useCallback(async (updatedTask) => {
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
        socket.emit("taskUpdated", updatedTask);
      }
    } catch (error) {
      console.error("Error modifying task:", error);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const response = await axios.delete(`${baseUrl}/tasks/delete/${taskId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        socket.emit("taskDeleted", taskId);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();

    const handleTaskAdded = (newTask) =>
      setTasks((prevTasks) => [...prevTasks, newTask]);
    const handleTaskUpdated = (updatedTask) =>
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    const handleTaskDeleted = (taskId) =>
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

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
    console.log("task has updated", [tasks]);
  });

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
