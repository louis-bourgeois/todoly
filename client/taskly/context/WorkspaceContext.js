"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const WorkspaceContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const { workspaces } = useUser();

  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      const personalWorkspace = workspaces.find(
        (workspace) => workspace.name === "Personal"
      );
      if (personalWorkspace && currentWorkspace === null) {
        setCurrentWorkspace(personalWorkspace.id);
      }
    }
  }, [workspaces]);

  const createWorkspace = async (name, userId) => {
    try {
      const response = await axios.post(`${baseUrl}/workspaces`, {
        name,
        userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    try {
      await axios.delete(`${baseUrl}/workspaces/${workspaceId}`);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const getWorkspace = async (workspaceId) => {
    try {
      const response = await axios.get(`${baseUrl}/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting workspace:", error);
    }
  };

  const addTaskToWorkspace = async (taskId, workspaceId) => {
    try {
      await axios.post(`${baseUrl}/workspaces/${workspaceId}/tasks`, {
        taskId,
      });
    } catch (error) {
      console.error("Error adding task to workspace:", error);
    }
  };

  const removeTaskFromWorkspace = async (taskId, workspaceId) => {
    try {
      await axios.delete(
        `${baseUrl}/workspaces/${workspaceId}/tasks/${taskId}`
      );
    } catch (error) {
      console.error("Error removing task from workspace:", error);
    }
  };

  const getUsersFromWorkspace = async (workspaceId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/workspaces/${workspaceId}/users`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting users from workspace:", error);
    }
  };

  const getTasksFromWorkspace = async (workspaceId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/workspaces/${workspaceId}/tasks`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting tasks from workspace:", error);
    }
  };

  const addUserToWorkspace = async (userId, workspaceId) => {
    try {
      await axios.post(`${baseUrl}/workspaces/${workspaceId}/users`, {
        userId,
      });
    } catch (error) {
      console.error("Error adding user to workspace:", error);
    }
  };

  const removeUserFromWorkspace = async (userId, workspaceId) => {
    try {
      await axios.delete(
        `${baseUrl}/workspaces/${workspaceId}/users/${userId}`
      );
    } catch (error) {
      console.error("Error removing user from workspace:", error);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        setCurrentWorkspace,
        currentWorkspace,
        createWorkspace,
        deleteWorkspace,
        getWorkspace,
        addTaskToWorkspace,
        removeTaskFromWorkspace,
        getUsersFromWorkspace,
        getTasksFromWorkspace,
        addUserToWorkspace,
        removeUserFromWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
