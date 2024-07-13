"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { useUserPreferences } from "./UserPreferencesContext";

const WorkspaceContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const { preferences, setWorkspaces, setSections } = useUser();
  const { updateUserPreference } = useUserPreferences();
  const [currentWorkspace, setCurrentWorkspace] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("");

  useEffect(() => {
    console.log("====================================");
    console.log("activeWorkspace has changed", activeWorkspace);
    console.log("====================================");
  }, [activeWorkspace]);
  useEffect(() => {
    if (
      preferences?.Current_Workspace &&
      preferences.Current_Workspace !== currentWorkspace
    ) {
      setCurrentWorkspace(preferences.Current_Workspace);
    }
  }, [preferences]);

  useEffect(() => {
    const updatePref = async () => {
      if (currentWorkspace) {
        await updateUserPreference({
          key: "Current_Workspace",
          value: currentWorkspace,
        });
      }
    };
    updatePref();
  }, [currentWorkspace]);

  const createWorkspace = async (workspace) => {
    try {
      const { name, linked_sections, collaborators } = workspace;
      const responseA = await axios.post(
        `${baseUrl}/workspaces`,
        { name, linked_sections },
        { withCredentials: true }
      );
      const workspaceId = responseA.data.workspaceId;

      const collaboratorPromises = collaborators.map(async (collaborator) => {
        try {
          const response = await axios.post(`${baseUrl}/users/find/`, {
            username: collaborator.name,
          });
          if (response.data.id) {
            await axios.post(
              `${baseUrl}/users/${workspaceId}/users/${response.data.id}`
            );
          }
        } catch (err) {
          console.error(`Error adding collaborator ${collaborator.name}:`, err);
        }
      });

      await Promise.all(collaboratorPromises);
      setWorkspaces(responseA.data.workspaces);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };

  const updateWorkspace = async (workspaceId, newWorkspaceData) => {
    console.log("sent : ", newWorkspaceData);
    try {
      const response = await axios.post(
        `${baseUrl}/workspaces/update/${workspaceId}`,
        { data: newWorkspaceData },
        { withCredentials: true }
      );
      console.log("ok", response.data);
      const { workspaces, sections } = response.data;
      console.table("updated sections", sections)
      setWorkspaces(workspaces);
      setSections(sections);
    } catch (error) {}
  };
  const deleteWorkspace = async (workspaceId) => {
    try {
      const response = await axios.delete(
        `${baseUrl}/workspaces/${workspaceId}`
      );
      console.log(response.data);
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
        updateWorkspace,
        addTaskToWorkspace,
        removeTaskFromWorkspace,
        getUsersFromWorkspace,
        getTasksFromWorkspace,
        addUserToWorkspace,
        removeUserFromWorkspace,
        activeWorkspace,
        setActiveWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
