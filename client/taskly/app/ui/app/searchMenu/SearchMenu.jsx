"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../../../context/MenuContext";
import { useTag } from "../../../../context/TagContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

const SearchMenu = () => {
  const router = useRouter();
  const { addTag } = useUser();
  const { tasks } = useTask();
  const { tags } = useTag();
  const { workspaces } = useWorkspace();
 const { toggleTaskMenu, isSearchMenuOpen, toggleSearchMenu } = useMenu();
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

  useEffect(() => {
    setVisibility(isSearchMenuOpen);
    resetState();
  }, [isSearchMenuOpen]);

  const filteredResults = useMemo(() => {
    if (query.startsWith("/")) {
      // Command mode
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
      // Task action mode
      return [
        { id: "update", title: `Update task: ${selectedTask.title}` },
        { id: "delete", title: `Delete task: ${selectedTask.title}` },
      ];
    } else if (commandMode === "addTag") {
      return tags.map((tag) => ({ id: tag.id, title: tag.name }));
    } else {
      let filteredTasks = tasks.filter(
        (task) =>
          task.title && task.title.toLowerCase().includes(query.toLowerCase())
      );

      return filteredTasks;
    }
  }, [query, tasks, selectedTask, commandMode, workspaces, tags]);

  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setIsMenuVisible(newQuery.length > 0);
    setSelectedIndex(-1);
    setSelectedTask(null);
    setCommandMode(null);
  };

  const handleKeyDown = (e) => {
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
  };

  const handleResultSelection = (result) => {
    if (query.startsWith("/")) {
      // Handle command
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
      // TODO: Implement change workspace logic
      console.log("Change to workspace:", result.title);
      resetState();
    } else if (commandMode === "deleteWorkspace") {
      // TODO: Implement delete workspace logic
      console.log("Delete workspace:", result.title);
      resetState();
    } else if (selectedTask) {
      // Handle task action
      switch (result.id) {
        case "update":
          toggleTaskMenu(selectedTask.id, "", "Task");
          break;
        case "delete":
          // TODO: Implement delete task logic
          console.log("Delete task:", selectedTask.title);
          break;
      }
      resetState();
    } else {
      // Handle task selection
      setSelectedTask(result);
      setSelectedIndex(-1);
    }
  };

  const handleCommand = (commandId) => {
    switch (commandId) {
      case "add":
        // TODO: Implement open add menu logic
        console.log("Open add menu");
        break;
      case "logout":
        // TODO: Implement logout logic
        console.log("Logout");
        break;
      case "addWorkspace":
        // TODO: Implement add workspace logic
        console.log("Add workspace");
        break;
      case "openMainMenu":
        // TODO: Implement open main menu logic
        console.log("Open main menu");
        break;
      case "openSettings":
        // TODO: Implement open settings logic
        console.log("Open settings");
        break;
    }
    resetState();
  };

  const handleAddTag = (tagName) => {
    addTag(tagName);
    resetState();
  };

  const resetState = () => {
    setIsMenuVisible(false);
    setSelectedTask(null);
    setCommandMode(null);
    setQuery("");
    setPlaceholder("Search or type / for commands...");
  };

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
  }, [filteredResults, selectedIndex, commandMode, query]);

  return (
    <div
      className={`fixed inset-0 flex items-start justify-center pt-16 z-50 bg-black transition-opacity duration-300 ease-in-out ${
        visibility ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
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
        onClick={(e) => e.stopPropagation()} // Add this line
      >
        <SearchInput
          query={query}
          onQueryChange={handleQueryChange}
          placeholder={placeholder}
        />
        {isMenuVisible && (
          <SearchResults
            results={filteredResults}
            selectedIndex={selectedIndex}
            onItemClick={handleResultSelection}
          />
        )}
      </div>
    </div>
  );
};
export default SearchMenu;
