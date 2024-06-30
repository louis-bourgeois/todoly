"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useError } from "./ErrorContext"; // Import the ErrorContext

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
  const { handleError } = useError(); // Use handleError from ErrorContext

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/me`, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.user) {
          setUser({ ...response.data.user });
          setTasks(response.data.user.tasks || []);
          setSections(response.data.user.sections || []);
          setTags(response.data.user.tags || []);
          setWorkspaces(response.data.user.workspaces || []);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (data) => {
    try {
      const response = await axios.post(`${baseUrl}/users/login`, data, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser({ ...response.data.user[1], ...response.data.user[3] });
        setTasks(response.data.user[1].tasks || []);
        setSections(response.data.user[1].sections || []);
        setTags(response.data.user[1].tags || []);
        setWorkspaces(response.data.user[1].workspaces || []);
        return response;
      }
    } catch (error) {
      return {
        status: error.response?.status || 500,
        data: { message: error.message },
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTasks(null);
    setSections(null);
    setTags(null);
    setWorkspaces(null);
  };

  const modifyTask = async (updatedTask, action) => {
    try {
      const response = await axios.post(
        `${baseUrl}/tasks/update`,
        { task: updatedTask, action },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Mettre à jour les tasks
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );

        // Mettre à jour les workspaces
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
  };

  const addTask = async (taskData) => {
    try {
      const response = await axios.post(
        `${baseUrl}/tasks/add`,
        { taskData },
        { withCredentials: true }
      );
      console.log(response.data);
      if (response.status === 201 && response.data.tasks) {
        setTasks(response.data.tasks);
        setWorkspaces(response.data.workspaces);
      } else {
        console.error("Error: No task data in response", response.data);
      }
    } catch (error) {
      console.error(error);
      handleError(error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/tasks/delete/${id}`);
      if (response.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

        setWorkspaces((prevWorkspaces) =>
          prevWorkspaces.map((workspace) => {
            // Filtrer les tasks du workspace pour supprimer celle avec l'ID donné
            const updatedTasks = workspace.tasks.filter(
              (task) => task.id !== id
            );
            return {
              ...workspace,
              tasks: updatedTasks,
            };
          })
        );
      }
    } catch (error) {
      handleError(error);
      throw error;
    }
  };

  const addSection = async (section) => {
    try {
      const response = await axios.post(
        `${baseUrl}/sections/add`,
        { section, user },
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.sections) {
        setSections(response.data.sections);
      } else {
        console.error("Error: No section data in response", response.data);
      }
    } catch (error) {
      handleError(error);
      throw new Error(error);
    }
  };

  const modifySection = async (newName, sectionId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/sections/update`,
        { newName: newName, sectionId: sectionId },
        { withCredentials: true }
      );
      setSections(response.data.user_sections);
    } catch (error) {
      handleError(error);
      throw new Error(error);
    }
  };

  const deleteSection = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/sections/delete/${id}`, {
        withCredentials: true,
      });
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
  };

  const addTag = async (name) => {
    try {
      const response = await axios.post(
        `${baseUrl}/tags/add`,
        { name },
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.tags) {
        setTags(response.data.tags);
        return response.data.tags;
      } else {
        console.error("Error: No tags data in response", response.data);
      }
    } catch (error) {
      handleError(error);
      throw new Error(error);
    }
  };

  const updateTag = async (name, id) => {
    try {
      const response = await axios.post(
        `${baseUrl}/tags/update`,
        { newName: name, id: id },
        { withCredentials: true }
      );
      setTags(response.data.tags);
    } catch (error) {
      handleError(error);
      throw new Error(error);
    }
  };

  const getUserWorkspaces = async () => {
    try {
      const data = axios.get(`${baseUrl}/users/workspaces`, {
        withCredentials: true,
      });
      setWorkspaces(data);
    } catch (error) {}
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        loading,
        logout,
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
