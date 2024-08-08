"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
import { useTag } from "../../../../context/TagContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

const SearchMenu = () => {
  const router = useRouter();
  const { addTag } = useUser() || {}; // Assure that addTag is defined
  const { tasks } = useTask() || { tasks: [] }; // Assure tasks is defined
  const { tags } = useTag() || { tags: [] }; // Assure tags is defined
  const { workspaces } = useWorkspace() || { workspaces: [] }; // Assure workspaces is defined
  const { toggleTaskMenu, isSearchMenuOpen, toggleSearchMenu } =
    useMenu() || {}; // Assure functions are defined

  const [query, setQuery] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commandMode, setCommandMode] = useState(null);
  const [placeholder, setPlaceholder] = useState(
    "Search or type / for commands..."
  );
  const [visibility, setVisibility] = useState(isSearchMenuOpen);
  const menuRef = useRef(null);

  const resetState = useCallback(() => {
    setIsMenuVisible(false);
    setSelectedTask(null);
    setCommandMode(null);
    setQuery("");
    setPlaceholder("Search or type / for commands...");
  }, []);

  const filteredResults = useMemo(() => {
    if (query.startsWith("/")) {
      const commands = [
        { id: "add", title: "Open add Menu" },
        { id: "goto", title: "Go to" },
        { id: "logout", title: "Logout" },
        { id: "addWorkspace", title: "Add Workspace" },
        { id: "openMainMenu", title: "Open Main Menu" },
        { id: "openSettings", title: "Open Settings" },
        { id: "changeWorkspace", title: "Change Current Workspace" },
        { id: "deleteWorkspace", title: "Delete Workspace" },
        { id: "addTag", title: "Add Tag" },
      ];
      return commands.filter((cmd) =>
        cmd.title.toLowerCase().includes(query.slice(1).toLowerCase())
      );
    } else if (commandMode === "goto") {
      return [
        { id: "currently", title: "Currently" },
        { id: "all", title: "All" },
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
        { id: "update", title: `Update task: ${selectedTask.title}` },
        { id: "delete", title: `Delete task: ${selectedTask.title}` },
      ];
    } else if (commandMode === "addTag") {
      return tags.map((tag) => ({ id: tag.id, title: tag.name }));
    } else {
      return tasks.filter(
        (task) =>
          task.title && task.title.toLowerCase().includes(query.toLowerCase())
      );
    }
  }, [query, tasks, selectedTask, commandMode, workspaces, tags]);

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setIsMenuVisible(newQuery.length > 0);
    setSelectedIndex(-1);
    setSelectedTask(null);
    setCommandMode(null);
  };

  const handleAddTag = useCallback(
    (tagName) => {
      if (addTag) {
        addTag(tagName);
        resetState();
      }
    },
    [addTag, resetState]
  );
  const handleCommand = useCallback(
    (commandId) => {
      switch (commandId) {
        case "add":
          console.log("Open add menu");
          break;
        case "logout":
          console.log("Logout");
          break;
        case "addWorkspace":
          console.log("Add workspace");
          break;
        case "openMainMenu":
          console.log("Open main menu");
          break;
        case "openSettings":
          console.log("Open settings");
          break;
      }
      resetState();
    },
    [resetState]
  );
  const handleResultSelection = useCallback(
    (result) => {
      if (query.startsWith("/")) {
        setCommandMode(result.id);
        setQuery("");
        if (result.id === "goto") {
          setPlaceholder("Select destination");
        } else if (
          result.id === "changeWorkspace" ||
          result.id === "deleteWorkspace"
        ) {
          setPlaceholder("Select workspace");
        } else if (result.id === "addTag") {
          setPlaceholder("New tag name");
        } else {
          handleCommand(result.id);
        }
      } else if (commandMode === "goto") {
        router.push(`/app/${result.id}`);
        resetState();
      } else if (commandMode === "changeWorkspace") {
        console.log("Change to workspace:", result.title);
        resetState();
      } else if (commandMode === "deleteWorkspace") {
        console.log("Delete workspace:", result.title);
        resetState();
      } else if (selectedTask) {
        switch (result.id) {
          case "update":
            if (toggleTaskMenu) toggleTaskMenu(selectedTask.id, "", "Task");
            break;
          case "delete":
            console.log("Delete task:", selectedTask.title);
            break;
        }
        resetState();
      } else {
        setSelectedTask(result);
        setSelectedIndex(-1);
      }
    },
    [
      query,
      commandMode,
      router,
      handleCommand,
      resetState,
      toggleTaskMenu,
      selectedTask,
      setSelectedTask,
      setSelectedIndex,
    ]
  );

  useEffect(() => {
    setVisibility(isSearchMenuOpen);
    resetState();
  }, [isSearchMenuOpen, resetState]);

  const handleKeyDown = useCallback(
    (e) => {
      if (visibility) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredResults.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredResults.length - 1
          );
        } else if (e.key === "Enter") {
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
        toggleSearchMenu();
      }}
    >
      <div
        ref={menuRef}
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 z-[500] -translate-y-[20vh] w-[35vw] mx-auto transition-opacity duration-300 ease-in-out ${
          visibility ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <SearchInput
          query={query}
          placeholder={placeholder}
          onQueryChange={handleQueryChange}
        />
        <SearchResults
          results={filteredResults}
          selectedIndex={selectedIndex}
          onResultSelect={handleResultSelection}
        />
      </div>
    </div>
  );
};

export default SearchMenu;
