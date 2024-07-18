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
import { useAuth } from "./AuthContext";
import { useSection } from "./SectionContext";
import { useUserPreferences } from "./UserPreferencesContext";

const WorkspaceContext = createContext();
const baseUrl = "http://localhost:3001/api";
export const useWorkspace = () => useContext(WorkspaceContext);

export const WorkspaceProvider = ({ children }) => {
  const { updateUserPreference, preferences } = useUserPreferences();
  const [currentWorkspace, setCurrentWorkspace] = useState("");
  const [activeWorkspace, setActiveWorkspace] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const { isAuthenticated, checkAuth } = useAuth();
  const { setSections } = useSection();

  const fetchWorkspaces = useCallback(async () => {

    if (!isAuthenticated) return;

    try {
      const response = await axios.get(`${baseUrl}/users/workspaces`, {
        withCredentials: true,
      });
      setWorkspaces(response.data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (
      preferences?.Current_Workspace &&
      preferences.Current_Workspace !== currentWorkspace
    ) {
      setCurrentWorkspace(preferences.Current_Workspace);
    }
  }, [preferences]);

  const updateCurrentWorkspace = useCallback(
    async (newWorkspace) => {
      if (newWorkspace !== currentWorkspace) {
        setCurrentWorkspace(newWorkspace);
        await updateUserPreference({
          key: "Current_Workspace",
          value: newWorkspace,
        });
      }
    },
    [currentWorkspace, updateUserPreference]
  );

  const createWorkspace = useCallback(
    async (workspace) => {
      try {
        const { name, linked_sections, collaborators } = workspace;
        const response = await axios.post(
          `${baseUrl}/workspaces`,
          { name, linked_sections },
          { withCredentials: true }
        );
        const workspaceId = response.data.workspaceId;

        await Promise.all(
          collaborators.map(async (collaborator) => {
            try {
              const userResponse = await axios.post(`${baseUrl}/users/find/`, {
                username: collaborator.name,
              });
              if (userResponse.data.id) {
                await axios.post(
                  `${baseUrl}/users/${workspaceId}/users/${userResponse.data.id}`
                );
              }
            } catch (err) {
              console.error(
                `Error adding collaborator ${collaborator.name}:`,
                err
              );
            }
          })
        );

        await fetchWorkspaces();
      } catch (error) {
        console.error("Error creating workspace:", error);
      }
    },
    [fetchWorkspaces]
  );

  const updateWorkspace = useCallback(
    async (workspaceId, newWorkspaceData) => {
      try {
        const response = await axios.post(
          `${baseUrl}/workspaces/update/${workspaceId}`,
          { data: newWorkspaceData },
          { withCredentials: true }
        );
        const { workspaces, sections } = response.data;
        setWorkspaces(workspaces);
        setSections(sections);
      } catch (error) {
        console.error("Error updating workspace:", error);
      }
    },
    [setSections]
  );

  const deleteWorkspace = useCallback(
    async (workspaceId) => {
      try {
        await axios.delete(`${baseUrl}/workspaces/${workspaceId}`);
        await fetchWorkspaces();
      } catch (error) {
        console.error("Error deleting workspace:", error);
      }
    },
    [fetchWorkspaces]
  );

  const getWorkspace = useCallback(async (workspaceId) => {
    try {
      const response = await axios.get(`${baseUrl}/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting workspace:", error);
    }
  }, []);

  const addTaskToWorkspace = useCallback(async (taskId, workspaceId) => {
    try {
      await axios.post(`${baseUrl}/workspaces/${workspaceId}/tasks`, {
        taskId,
      });
    } catch (error) {
      console.error("Error adding task to workspace:", error);
    }
  }, []);

  const removeTaskFromWorkspace = useCallback(async (taskId, workspaceId) => {
    try {
      await axios.delete(
        `${baseUrl}/workspaces/${workspaceId}/tasks/${taskId}`
      );
    } catch (error) {
      console.error("Error removing task from workspace:", error);
    }
  }, []);

  const getUsersFromWorkspace = useCallback(async (workspaceId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/workspaces/${workspaceId}/users`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting users from workspace:", error);
    }
  }, []);

  const getTasksFromWorkspace = useCallback(async (workspaceId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/workspaces/${workspaceId}/tasks`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting tasks from workspace:", error);
    }
  }, []);

  const addUserToWorkspace = useCallback(async (userId, workspaceId) => {
    try {
      await axios.post(`${baseUrl}/workspaces/${workspaceId}/users`, {
        userId,
      });
    } catch (error) {
      console.error("Error adding user to workspace:", error);
    }
  }, []);

  const removeUserFromWorkspace = useCallback(async (userId, workspaceId) => {
    try {
      await axios.delete(
        `${baseUrl}/workspaces/${workspaceId}/users/${userId}`
      );
    } catch (error) {
      console.error("Error removing user from workspace:", error);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      workspaces,
      setWorkspaces,
      currentWorkspace,
      setCurrentWorkspace: updateCurrentWorkspace,
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
    }),
    [
      workspaces,
      currentWorkspace,
      updateCurrentWorkspace,
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
    ]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};
