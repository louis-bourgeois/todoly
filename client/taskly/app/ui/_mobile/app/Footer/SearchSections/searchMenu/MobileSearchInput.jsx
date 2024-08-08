import { debounce } from "lodash";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useMenu } from "../../../../../../../context/MenuContext";
import { useTag } from "../../../../../../../context/TagContext";
import { useTask } from "../../../../../../../context/TaskContext";
import { useWorkspace } from "../../../../../../../context/WorkspaceContext";
import { useMobileSearch } from "../../../../../../../context/searchContext";

export default function MobileSearchInput({ onNavigate }) {
  const { setCardType, toggleTaskMenu } = useMenu();
  const {
    searchQuery,
    setSearchQuery,
    setSuggestions,
    setCommandMode,
    setSelectedTask,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    commandMode,
  } = useMobileSearch();
  const { tasks } = useTask();
  const { workspaces } = useWorkspace();
  const { tags } = useTag();
  const pathname = usePathname();

  // Mémoriser la fonction debounced
  const debouncedSetSuggestions = useMemo(
    () =>
      debounce(
        (
          value,
          commandMode,
          workspaces,
          tags,
          tasks,
          setSuggestions,
          setCommandMode,
          setSelectedTask
        ) => {
          if (value.startsWith("/")) {
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
            setSuggestions(
              commands.filter((cmd) =>
                cmd.title.toLowerCase().includes(value.slice(1).toLowerCase())
              )
            );
            setCommandMode("command");
          } else if (commandMode === "goto") {
            setSuggestions([
              { id: "currently", title: "Currently" },
              { id: "all", title: "All" },
            ]);
          } else if (
            commandMode === "changeWorkspace" ||
            commandMode === "deleteWorkspace"
          ) {
            setSuggestions(
              workspaces.map((workspace) => ({
                id: workspace.id,
                title: workspace.name,
              }))
            );
          } else if (commandMode === "addTag") {
            setSuggestions(
              tags.map((tag) => ({
                id: tag.id,
                title: tag.name,
              }))
            );
          } else {
            // Task search mode
            const filteredTasks = tasks.filter(
              (task) =>
                task.title &&
                task.title.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredTasks);
            setCommandMode(null);
            setSelectedTask(null);
          }
        },
        300
      ),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSetSuggestions(
      value,
      commandMode,
      workspaces,
      tags,
      tasks,
      setSuggestions,
      setCommandMode,
      setSelectedTask
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      e.preventDefault();
      handleResultSelection(suggestions[selectedIndex]);
    }
  };

  const handleResultSelection = (result) => {
    if (commandMode === "command") {
      handleCommand(result.id);
    } else if (commandMode === "goto") {
      onNavigate(`/app/${result.id}`);
      resetState();
    } else if (commandMode === "changeWorkspace") {
      // TODO: Implement change workspace logic
      console.log("Change to workspace:", result.title);
      resetState();
    } else if (commandMode === "deleteWorkspace") {
      // TODO: Implement delete workspace logic
      console.log("Delete workspace:", result.title);
      resetState();
    } else if (commandMode === "addTag") {
      // TODO: Implement add tag logic
      console.log("Add tag:", result.title);
      resetState();
    } else {
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
      case "goto":
      case "changeWorkspace":
      case "deleteWorkspace":
      case "addTag":
        setCommandMode(commandId);
        setSearchQuery("");
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
  };

  const resetState = useCallback(() => {
    const lastSegment = pathname.split("/").pop();
    setSearchQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
    setCommandMode(null);
    setSelectedTask(null);
    setCardType(
      lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).toLowerCase()
    );
  }, [
    pathname,
    setCardType,
    setSearchQuery,
    setSuggestions,
    setSelectedIndex,
    setCommandMode,
    setSelectedTask,
  ]);

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  return (
    <div className="bg-primary flex rounded-full justify-start px-[15px] border py-[10px] mr-[2.5%] items-center shadow-shadow_01 w-3/4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="19"
        height="21"
        viewBox="0 0 19 21"
        fill="none"
      >
        <path
          d="M12.0826 14.0477C10.068 15.8873 7.05543 16.4669 4.52119 15.3833C1.46547 14.0769 -0.481036 10.402 0.103575 6.98273C0.688532 3.56114 3.73073 0.79352 7.13261 0.714632C7.19521 0.713544 7.25782 0.713181 7.3206 0.713362C10.664 0.74655 13.816 3.44453 14.4353 6.93594C14.8505 9.27611 14.1346 11.8044 12.5816 13.5432L18.6145 19.6765C18.7438 19.8194 18.7215 19.8669 18.7194 19.9465C18.7121 20.2231 18.3535 20.4048 18.1308 20.1966L12.0826 14.0477ZM7.23094 1.43877C4.24666 1.46833 1.44639 3.82773 0.82571 6.89949C0.368913 9.16077 1.08845 11.6448 2.67076 13.2601C4.4879 15.1149 7.36413 15.7377 9.76327 14.7118C12.5386 13.5254 14.3038 10.1718 13.7532 7.06814C13.2075 3.99113 10.4825 1.5115 7.40124 1.43986C7.34448 1.43896 7.28771 1.43859 7.23094 1.43877Z"
          fill="#007AFF"
        />
      </svg>
      <input
        disabled={true}
        type="text"
        name="collaborators"
        className="bg-transparent placeholder:text-gray placeholder:text-[13px] w-full text-center pr-5 focus:outline-none text-text"
        placeholder="Type a command or search"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setCardType("Search")}
      />
    </div>
  );
}
