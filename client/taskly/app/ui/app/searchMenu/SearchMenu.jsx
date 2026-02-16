"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useMenu } from "../../../../context/MenuContext";
import { useTag } from "../../../../context/TagContext";
import { useTask } from "../../../../context/TaskContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";
import SearchInput from "./SearchInput";
import SearchShortcuts from "./SearchShortcuts";
import SearchResults from "./SearchResults";
import { useTranslation } from "../../../i18n/client";

const SearchMenu = () => {
  const router = useRouter();
  const { logout } = useAuth() || {};
  const taskContext = useTask() || {};
  const { tasks = [], deleteTask } = taskContext;
  const tagContext = useTag() || {};
  const { tags = [], addTag, updateTag } = tagContext;
  const workspaceContext = useWorkspace() || {};
  const {
    workspaces = [],
    setCurrentWorkspace,
    deleteWorkspace,
  } = workspaceContext;
  const {
    toggleTaskMenu,
    isSearchMenuOpen,
    toggleSearchMenu,
    toggleViewsMenu,
    isViewsMenuOpen,
    isTaskMenuOpen,
  } = useMenu() || {};
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commandMode, setCommandMode] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);
  const defaultPlaceholder = useMemo(() => t("searchMenu.placeholder"), [t]);
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
  const [visibility, setVisibility] = useState(isSearchMenuOpen);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!commandMode) {
      setPlaceholder(defaultPlaceholder);
    }
  }, [defaultPlaceholder, commandMode]);

  const resetState = useCallback(() => {
    setIsMenuVisible(false);
    setSelectedTask(null);
    setCommandMode(null);
    setEditingTagId(null);
    setQuery("");
    setSelectedIndex(-1);
    setPlaceholder(defaultPlaceholder);
  }, [defaultPlaceholder]);

  const closeSearchMenu = useCallback(() => {
    resetState();
    if (toggleSearchMenu) toggleSearchMenu();
  }, [resetState, toggleSearchMenu]);

  const filteredResults = useMemo(() => {
    if (query.startsWith("/")) {
      const commands = [
        { id: "add", title: t('searchMenu.openAddMenu') },
        { id: "goto", title: t('searchMenu.goTo') },
        { id: "logout", title: t('searchMenu.logout') },
        { id: "addWorkspace", title: t('searchMenu.addWorkspace') },
        { id: "openMainMenu", title: t('searchMenu.openMainMenu') },
        { id: "openSettings", title: t('searchMenu.openSettings') },
        { id: "changeWorkspace", title: t('searchMenu.changeWorkspace') },
        { id: "deleteWorkspace", title: t('searchMenu.deleteWorkspace') },
        { id: "addTag", title: t('searchMenu.addTag') },
      ];
      return commands.filter((cmd) =>
        cmd.title.toLowerCase().includes(query.slice(1).toLowerCase())
      );
    } else if (commandMode === "goto") {
      return [
        { id: "currently", title: t('searchMenu.currently') },
        { id: "all", title: t('searchMenu.all') },
        { id: "statistique", title: t("searchMenu.statistics") },
      ];
    } else if (
      commandMode === "changeWorkspace" ||
      commandMode === "deleteWorkspace"
    ) {
      return workspaces.map((workspace) => ({
        id: workspace.id,
        title: workspace.name,
      }));
    } else if (selectedTask) {
      return [
        { id: "update", title: `${t('searchMenu.updateTask')}: ${selectedTask.title}` },
        { id: "delete", title: `${t('searchMenu.deleteTask')}: ${selectedTask.title}` },
      ];
    } else if (commandMode === "addTag") {
      return tags.map((tag) => ({ id: tag.id, title: tag.name }));
    } else {
      return tasks.filter(
        (task) =>
          task.title && task.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  }, [query, tasks, selectedTask, commandMode, workspaces, tags, t]);

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setIsMenuVisible(
      newQuery.length > 0 || commandMode !== null || selectedTask !== null
    );
    setSelectedIndex(-1);
    if (newQuery.startsWith("/")) {
      setSelectedTask(null);
      setCommandMode(null);
      setEditingTagId(null);
      setPlaceholder(defaultPlaceholder);
    }
  };

  const handleAddTag = useCallback(
    async (tagName) => {
      const trimmed = tagName?.trim();
      if (!trimmed) return;
      if (editingTagId && updateTag) {
        await updateTag(trimmed, editingTagId);
      } else if (addTag) {
        await addTag(trimmed);
      }
      setEditingTagId(null);
      setQuery("");
      setCommandMode("addTag");
      setIsMenuVisible(true);
      setSelectedIndex(0);
      setPlaceholder(t("searchMenu.newTagName"));
    },
    [addTag, updateTag, editingTagId, t]
  );
  const handleCommand = useCallback(
    async (commandId) => {
      switch (commandId) {
        case "add":
          if (toggleTaskMenu) toggleTaskMenu("", "", "Task");
          break;
        case "logout":
          if (logout) await logout();
          break;
        case "addWorkspace":
          if (toggleTaskMenu) toggleTaskMenu("", "", "Workspace");
          break;
        case "openMainMenu":
          router.push("/app");
          break;
        case "openSettings":
          router.push("/app/profile");
          break;
      }
      closeSearchMenu();
    },
    [router, toggleTaskMenu, logout, closeSearchMenu]
  );

  const navigateTo = useCallback(
    (destination) => {
      if (!destination) return;
      router.push(`/app/${destination}`);
      closeSearchMenu();
    },
    [router, closeSearchMenu]
  );

  const handleResultSelection = useCallback(
    (result) => {
      if (!result) return;

      if (query.startsWith("/")) {
        setSelectedIndex(-1);
        setQuery("");
        setEditingTagId(null);
        switch (result.id) {
          case "goto":
            setCommandMode("goto");
            setPlaceholder(t("searchMenu.selectDestination"));
            setIsMenuVisible(true);
            return;
          case "changeWorkspace":
          case "deleteWorkspace":
            setCommandMode(result.id);
            setEditingTagId(null);
            setPlaceholder(t("searchMenu.selectWorkspace"));
            setIsMenuVisible(true);
            return;
          case "addTag":
            setCommandMode("addTag");
            setEditingTagId(null);
            setPlaceholder(t("searchMenu.newTagName"));
            setIsMenuVisible(true);
            return;
          default:
            handleCommand(result.id);
            return;
        }
      }

      if (commandMode === "goto") {
        navigateTo(result.id);
        return;
      }

      if (commandMode === "changeWorkspace") {
        setEditingTagId(null);
        if (setCurrentWorkspace) setCurrentWorkspace(result.id);
        closeSearchMenu();
        return;
      }

      if (commandMode === "deleteWorkspace") {
        setEditingTagId(null);
        if (deleteWorkspace) deleteWorkspace(result.id);
        closeSearchMenu();
        return;
      }

      if (commandMode === "addTag") {
        setEditingTagId(result.id);
        setQuery(result.title || "");
        setPlaceholder(t("searchMenu.newTagName"));
        setIsMenuVisible(true);
        return;
      }

      if (selectedTask) {
        switch (result.id) {
          case "update":
            if (toggleTaskMenu)
              toggleTaskMenu(selectedTask.id, "", "Task");
            break;
          case "delete":
            if (deleteTask) deleteTask(selectedTask.id);
            break;
        }
        setEditingTagId(null);
        closeSearchMenu();
        return;
      }

      setSelectedTask(result);
      setEditingTagId(null);
      setSelectedIndex(-1);
      setQuery("");
      setIsMenuVisible(true);
      setPlaceholder(
        `${t("searchMenu.updateTask")} / ${t("searchMenu.deleteTask")}`
      );
    },
    [
      query,
      commandMode,
      handleCommand,
      navigateTo,
      closeSearchMenu,
      t,
      setCurrentWorkspace,
      deleteWorkspace,
      handleAddTag,
      selectedTask,
      toggleTaskMenu,
      deleteTask,
    ]
  );

  useEffect(() => {
    setVisibility(isSearchMenuOpen);
    resetState();
  }, [isSearchMenuOpen, resetState]);

  const handleKeyDown = useCallback(
    (e) => {
      const key = e.key?.toLowerCase?.() || e.key;

      if (key === "escape") {
        e.preventDefault();
        if (visibility) closeSearchMenu();
        if (isViewsMenuOpen && toggleViewsMenu) toggleViewsMenu();
        if (isTaskMenuOpen && toggleTaskMenu) toggleTaskMenu();
        return;
      }

      if (e.shiftKey && key === "a") {
        e.preventDefault();
        if (toggleTaskMenu) toggleTaskMenu("", "", "Task");
        return;
      }

      if (e.altKey && key === "v") {
        e.preventDefault();
        if (toggleViewsMenu) toggleViewsMenu();
        return;
      }

      if (visibility) {
        if (key === "arrowdown") {
          e.preventDefault();
          if (filteredResults.length === 0) return;
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : 0
          );
        } else if (key === "arrowup") {
          e.preventDefault();
          if (filteredResults.length === 0) return;
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredResults.length - 1
          );
        } else if (key === "enter") {
          e.preventDefault();
          if (commandMode === "addTag" && query.trim() !== "") {
            handleAddTag(query.trim());
          } else {
            const selectedResult =
              filteredResults[selectedIndex] || filteredResults[0];
            handleResultSelection(selectedResult);
          }
        }
      }
    },
    [
      visibility,
      filteredResults,
      selectedIndex,
      handleAddTag,
      handleResultSelection,
      query,
      commandMode,
      closeSearchMenu,
      toggleTaskMenu,
      toggleViewsMenu,
      router,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className={`fixed inset-0 flex items-start justify-center pt-16 z-50 transition-all duration-300 ease-in-out bg-secondary-overlay ${
        visibility ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => {
        closeSearchMenu();
      }}
    >
      <div
        ref={menuRef}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 z-[500] -translate-y-[20vh] w-[35vw] mx-auto transition-opacity duration-300 ease-in-out ${
          visibility ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col gap-3">
          <SearchInput
            query={query}
            placeholder={placeholder}
            onQueryChange={handleQueryChange}
          />
          {isMenuVisible && (
            <SearchResults
              results={filteredResults}
              selectedIndex={selectedIndex}
              onItemClick={handleResultSelection}
              commandMode={commandMode}
            />
          )}
          <SearchShortcuts />
        </div>
      </div>
    </div>
  );
};

export default SearchMenu;
