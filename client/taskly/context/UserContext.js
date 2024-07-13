"use client";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useError } from "./ErrorContext";

const socket = io("http://localhost:3001");
const UserContext = createContext();
const baseUrl = "http://localhost:3001/api";

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [tags, setTags] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { handleError } = useError();

  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${baseUrl}/users/me`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.user) {
        const {
          tasks = [],
          sections = [],
          tags = [],
          workspaces = [],
          preferences = [],
        } = response.data.user;
        setUser(response.data.user);
        setTasks(tasks);
        setSections(sections);
        setTags(tags);
        setWorkspaces(workspaces);
        setPreferences(
          preferences.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.preference_key]: curr.preference_value,
            }),
            {}
          )
        );
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleTaskAdded = (newTask) => {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) =>
          workspace.id === newTask.workspace_id
            ? { ...workspace, tasks: [...workspace.tasks, newTask] }
            : workspace
        )
      );
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) => ({
          ...workspace,
          tasks: workspace.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }))
      );
    };

    const handleTaskDeleted = (taskId) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.map((workspace) => ({
          ...workspace,
          tasks: workspace.tasks.filter((task) => task.id !== taskId),
        }))
      );
    };

    if (isAuthenticated) {
      socket.on("taskAdded", handleTaskAdded);
      socket.on("taskUpdated", handleTaskUpdated);
      socket.on("taskDeleted", handleTaskDeleted);
    }

    return () => {
      socket.off("taskAdded", handleTaskAdded);
      socket.off("taskUpdated", handleTaskUpdated);
      socket.off("taskDeleted", handleTaskDeleted);
    };
  }, [isAuthenticated]);

  const login = useCallback(
    async (data) => {
      try {
        const response = await axios.post(`${baseUrl}/users/login`, data, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          await fetchUser();
          return response;
        }
      } catch (error) {
        handleError(error);
        return {
          status: error.response?.status || 500,
          data: { message: error.message },
        };
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, handleError]
  );

  const logout = useCallback(() => {
    setUser(null);
    setTasks([]);
    setSections([]);
    setTags([]);
    setWorkspaces([]);
    setPreferences({});
    setIsAuthenticated(false);
  }, []);

  const modifyTask = useCallback(
    async (updatedTask, action) => {
      try {
        const response = await axios.post(
          `${baseUrl}/tasks/update`,
          { task: updatedTask, action },
          { withCredentials: true }
        );
        if (response.status === 200) {
          socket.emit("taskUpdated", updatedTask);
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
          setWorkspaces((prevWorkspaces) =>
            prevWorkspaces.map((workspace) => ({
              ...workspace,
              tasks: workspace.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              ),
            }))
          );
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  const addTask = useCallback(
    async (taskData) => {
      try {
        const response = await axios.post(
          `${baseUrl}/tasks/add`,
          { taskData },
          { withCredentials: true }
        );
        if (response.status === 201 && response.data.tasks) {
          const existingTaskIds = new Set(tasks.map((task) => task.id));
          const newTask = response.data.tasks.find(
            (task) => !existingTaskIds.has(task.id)
          );
          if (newTask) {
            socket.emit("taskAdded", newTask);
            setTasks((prevTasks) => [...prevTasks, newTask]);
            setWorkspaces((prevWorkspaces) =>
              prevWorkspaces.map((workspace) =>
                workspace.id === newTask.workspace_id
                  ? { ...workspace, tasks: [...workspace.tasks, newTask] }
                  : workspace
              )
            );
            return newTask;
          } else {
            throw new Error("Nouvelle tâche non trouvée dans la réponse");
          }
        } else {
          throw new Error("Réponse invalide du serveur");
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [tasks, handleError]
  );

  const deleteTask = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(`${baseUrl}/tasks/delete/${id}`);
        if (response.status === 200) {
          socket.emit("taskDeleted", id);
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
          setWorkspaces((prevWorkspaces) =>
            prevWorkspaces.map((workspace) => ({
              ...workspace,
              tasks: workspace.tasks.filter((task) => task.id !== id),
            }))
          );
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  const addSection = useCallback(
    async (section) => {
      try {
        const response = await axios.post(
          `${baseUrl}/sections/add`,
          { section, user },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.sections) {
          setSections(response.data.sections);
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [user, handleError]
  );

  const modifySection = useCallback(
    async (newName, sectionId) => {
      try {
        const response = await axios.post(
          `${baseUrl}/sections/update`,
          { newName, sectionId },
          { withCredentials: true }
        );
        setSections(response.data.user_sections);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  const deleteSection = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(
          `${baseUrl}/sections/delete/${id}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setSections((prev) =>
            prev.filter(
              (section) => section.id !== id || section.name === "Other"
            )
          );
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  const addTag = useCallback(
    async (name) => {
      try {
        const response = await axios.post(
          `${baseUrl}/tags/add`,
          { name },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.tags) {
          setTags(response.data.tags);
          return response.data.tags;
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  const updateTag = useCallback(
    async (name, id) => {
      try {
        const response = await axios.post(
          `${baseUrl}/tags/update`,
          { newName: name, id },
          { withCredentials: true }
        );
        setTags(response.data.tags);
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError]
  );

  const getUserWorkspaces = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}/users/workspaces`, {
        withCredentials: true,
      });
      setWorkspaces(response.data);
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  const contextValue = useMemo(
    () => ({
      user,
      login,
      loading,
      logout,
      isAuthenticated,
      tasks,
      modifyTask,
      addTask,
      deleteTask,
      addSection,
      modifySection,
      deleteSection,
      sections,
      setSections,
      addTag,
      updateTag,
      tags,
      getUserWorkspaces,
      workspaces,
      setWorkspaces,
      preferences,
      setPreferences,
    }),
    [
      user,
      login,
      loading,
      logout,
      isAuthenticated,
      tasks,
      modifyTask,
      addTask,
      deleteTask,
      addSection,
      modifySection,
      deleteSection,
      sections,
      addTag,
      updateTag,
      tags,
      getUserWorkspaces,
      workspaces,
      preferences,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
