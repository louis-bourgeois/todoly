"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { normalizeRecurrence } from "@/app/utils/recurrence";
import { useDemoMode } from "./DemoModeContext";
import {
  buildWorkspacesFromTasks,
  createDemoSeed,
  createDemoTask,
} from "./demo/demoData";

const DemoDataContext = createContext(null);

const createId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const todayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const DemoDataProvider = ({ children }) => {
  const { isDemoMode } = useDemoMode();
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({});
  const [workspaceMeta, setWorkspaceMeta] = useState([]);
  const [sections, setSections] = useState([]);
  const [tags, setTags] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    if (!isDemoMode) {
      setUser(null);
      setPreferences({});
      setWorkspaceMeta([]);
      setSections([]);
      setTags([]);
      setTasks([]);
      setCurrentWorkspace(null);
      setActiveWorkspace(null);
      setActiveTask(null);
      return;
    }

    const seed = createDemoSeed();
    setUser(seed.user);
    setPreferences(seed.preferences);
    setWorkspaceMeta(seed.workspaceMeta);
    setSections(seed.sections);
    setTags(seed.tags);
    setTasks(seed.tasks);
    setCurrentWorkspace(seed.preferences.Current_Workspace);
    setActiveWorkspace(null);
    setActiveTask(null);
  }, [isDemoMode]);

  const workspaces = useMemo(
    () => buildWorkspacesFromTasks(workspaceMeta, tasks),
    [workspaceMeta, tasks]
  );

  const updatePreference = async ({ key, value }) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "Current_Workspace") {
      setCurrentWorkspace(value);
    }
  };

  const addUserPreference = async ({ key, value }) => {
    await updatePreference({ key, value });
  };

  const getUserPreferences = async (keys = "*") => {
    if (keys === "*") return preferences;
    const keyList = Array.isArray(keys) ? keys : String(keys).split(",");
    return keyList.reduce((acc, key) => {
      acc[key] = preferences[key];
      return acc;
    }, {});
  };

  const addSection = async (section) => {
    const nextSection = {
      id: createId("section"),
      name: section.name?.trim() || "New section",
      workspace_id: section.workspace_id || currentWorkspace,
    };
    setSections((prev) => [...prev, nextSection]);
    return nextSection;
  };

  const modifySection = async (newName, sectionId) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, name: newName } : section
      )
    );
  };

  const deleteSection = async (sectionId) => {
    setSections((prev) =>
      prev.filter(
        (section) =>
          section.id !== sectionId || section.name === "Other"
      )
    );
  };

  const createWorkspace = async (workspace) => {
    const workspaceId = createId("workspace");
    const nextWorkspace = {
      id: workspaceId,
      name: workspace.name?.trim() || "New workspace",
      users: Array.isArray(workspace.collaborators)
        ? workspace.collaborators
        : [],
    };

    setWorkspaceMeta((prev) => [...prev, nextWorkspace]);
    setCurrentWorkspace(workspaceId);
    setPreferences((prev) => ({
      ...prev,
      Current_Workspace: workspaceId,
    }));

    const baseSections = Array.isArray(workspace.linked_sections)
      ? workspace.linked_sections
      : [];

    const normalizedSections = [
      ...baseSections.map((section) => ({
        id: createId("section"),
        name: section?.name?.trim() || "Untitled section",
        workspace_id: workspaceId,
      })),
      {
        id: createId("section"),
        name: "Other",
        workspace_id: workspaceId,
      },
    ];

    setSections((prev) => [...prev, ...normalizedSections]);
    return workspaceId;
  };

  const updateWorkspace = async (workspaceId, newWorkspaceData) => {
    setWorkspaceMeta((prev) =>
      prev.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              name: newWorkspaceData.name?.trim() || workspace.name,
              users: Array.isArray(newWorkspaceData.collaborators)
                ? newWorkspaceData.collaborators
                : workspace.users,
            }
          : workspace
      )
    );
  };

  const deleteWorkspace = async (workspaceId) => {
    const fallbackWorkspaceId =
      workspaceMeta.find((workspace) => workspace.name === "Personal")?.id ||
      workspaceMeta.find((workspace) => workspace.id !== workspaceId)?.id ||
      null;

    setWorkspaceMeta((prev) =>
      prev.filter((workspace) => workspace.id !== workspaceId)
    );
    setSections((prev) =>
      prev.filter((section) => section.workspace_id !== workspaceId)
    );
    setTasks((prev) => prev.filter((task) => task.workspace_id !== workspaceId));

    if (currentWorkspace === workspaceId && fallbackWorkspaceId) {
      setCurrentWorkspace(fallbackWorkspaceId);
      setPreferences((prev) => ({
        ...prev,
        Current_Workspace: fallbackWorkspaceId,
      }));
    }
  };

  const getWorkspace = async (workspaceId) =>
    workspaces.find((workspace) => workspace.id === workspaceId) || null;

  const addTask = async (taskData) => {
    const newTask = createDemoTask(taskData, currentWorkspace, tags);
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const modifyTask = async (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== updatedTask.id) return task;

        const nextStatus = updatedTask.status || task.status;
        const completionDate =
          updatedTask.completion_context_date ||
          updatedTask.last_completed_at ||
          todayKey();

        return {
          ...task,
          ...updatedTask,
          tags: Array.isArray(updatedTask.tags) ? updatedTask.tags : task.tags,
          subtasks: Array.isArray(updatedTask.subtasks)
            ? updatedTask.subtasks
            : task.subtasks,
          recurrence: normalizeRecurrence(
            updatedTask.recurrence || task.recurrence
          ),
          updated_at: new Date().toISOString(),
          completion_count:
            task.status !== "done" && nextStatus === "done"
              ? Number(task.completion_count || 0) + 1
              : Number(task.completion_count || 0),
          last_completed_at:
            task.status !== "done" && nextStatus === "done"
              ? completionDate
              : updatedTask.last_completed_at ?? task.last_completed_at,
        };
      })
    );
  };

  const deleteTask = async (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const addTag = async (name) => {
    const nextTag = { id: createId("tag"), name: name?.trim() || "New tag" };
    setTags((prev) => [...prev, nextTag]);
    return [...tags, nextTag];
  };

  const updateTag = async (name, id) => {
    setTags((prev) =>
      prev.map((tag) => (tag.id === id ? { ...tag, name } : tag))
    );
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.map((tag) => (tag.id === id ? { ...tag, name } : tag)),
      }))
    );
  };

  const deleteTag = async (id) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
    setTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag.id !== id),
      }))
    );
  };

  const setCurrentWorkspaceWithPreference = async (workspaceId) => {
    setCurrentWorkspace(workspaceId);
    setPreferences((prev) => ({
      ...prev,
      Current_Workspace: workspaceId,
    }));
  };

  const addTaskToWorkspace = async (taskId, workspaceId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, workspace_id: workspaceId } : task
      )
    );
  };

  const removeTaskFromWorkspace = async (taskId, workspaceId) => {
    setTasks((prev) =>
      prev.filter(
        (task) => !(task.id === taskId && task.workspace_id === workspaceId)
      )
    );
  };

  const getUsersFromWorkspace = async (workspaceId) =>
    workspaces.find((workspace) => workspace.id === workspaceId)?.users || [];

  const getTasksFromWorkspace = async (workspaceId) =>
    tasks.filter((task) => task.workspace_id === workspaceId);

  const addUserToWorkspace = async (userId, workspaceId) => {
    setWorkspaceMeta((prev) =>
      prev.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              users: [...(workspace.users || []), { id: userId }],
            }
          : workspace
      )
    );
  };

  const removeUserFromWorkspace = async (userId, workspaceId) => {
    setWorkspaceMeta((prev) =>
      prev.map((workspace) =>
        workspace.id === workspaceId
          ? {
              ...workspace,
              users: (workspace.users || []).filter((user) => user.id !== userId),
            }
          : workspace
      )
    );
  };

  const value = useMemo(
    () =>
      isDemoMode
        ? {
            user,
            setUser,
            preferences,
            setPreferences,
            workspaceMeta,
            workspaces,
            sections,
            setSections,
            tags,
            tasks,
            currentWorkspace,
            setCurrentWorkspace: setCurrentWorkspaceWithPreference,
            activeWorkspace,
            setActiveWorkspace,
            activeTask,
            setActiveTask,
            updatePreference,
            addUserPreference,
            getUserPreferences,
            addSection,
            modifySection,
            deleteSection,
            createWorkspace,
            updateWorkspace,
            deleteWorkspace,
            getWorkspace,
            addTask,
            modifyTask,
            deleteTask,
            addTag,
            updateTag,
            deleteTag,
            addTaskToWorkspace,
            removeTaskFromWorkspace,
            getUsersFromWorkspace,
            getTasksFromWorkspace,
            addUserToWorkspace,
            removeUserFromWorkspace,
          }
        : null,
    [
      isDemoMode,
      user,
      preferences,
      workspaceMeta,
      workspaces,
      sections,
      tags,
      tasks,
      currentWorkspace,
      activeWorkspace,
      activeTask,
    ]
  );

  return (
    <DemoDataContext.Provider value={value}>
      {children}
    </DemoDataContext.Provider>
  );
};

export const useDemoData = () => useContext(DemoDataContext);
