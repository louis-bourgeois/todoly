"use client";
import Downshift from "downshift";
import Fuse from "fuse.js";
import { useContext, useEffect, useRef, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { MenuContext } from "../../../../context/MenuContext";
import { useUser } from "../../../../context/UserContext";
import Blur from "../Blur";
import Div from "../Div";
import SearchMenuLibelle from "./SearchMenuLibelle";

// Définir les commandes
const commands = [
  { command: "/add", description: "Open task menu", action: "addTask" },
  {
    command: "/deleteTask",
    description: "Delete a task",
    action: "deleteTask",
  },
  // ... autres commandes
];

// Configurer Fuse.js
const fuseOptions = {
  keys: ["command", "description"],
  threshold: 0.3,
};
const fuse = new Fuse(commands, fuseOptions);

export default function SearchMenu({ visibility }) {
  const { toggleSearchMenu, isSearchMenuOpen, toggleTaskMenu } =
    useContext(MenuContext);
  const { deleteTaskByName, tasks } = useUser();

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isActionMode, setIsActionMode] = useState(false);
  const inputRef = useRef(null);

  const [pageName, setPageName] = useState("");

  useEffect(() => {
    if (inputValue === "") {
      setSuggestions([]);
    }
  }, [inputValue]);

  useEffect(() => {
    if (!visibility) {
      setInputValue(""); // Reset input value when menu is closed
      setSuggestions([]);
      setIsActionMode(false);
    }
    if (visibility && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visibility]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const segments = path.split("/").filter(Boolean);
      const name = segments.includes("app")
        ? segments.slice(segments.indexOf("app") + 1).join("/")
        : segments.join("/");
      const capitalizedPageName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setPageName(capitalizedPageName);
    }
  }, []);

  const handleInputChange = (value) => {
    setInputValue(value);
    setIsActionMode(false); // Reset action mode on input change

    if (value.startsWith("/")) {
      // Chercher parmi les commandes
      const commandResults = fuse.search(value);
      setSuggestions(commandResults.map((result) => result.item));
    } else {
      // Chercher parmi les tâches
      const taskResults = tasks.filter((task) =>
        task.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(
        taskResults.map((task) => ({ title: task.title, id: task.id }))
      );
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      setInputValue(suggestions[0].title || suggestions[0].command);
    } else if (e.key === "Enter") {
      executeCommand(inputValue);
    }
  };

  const executeCommand = (commandInput) => {
    const command = commands.find(
      (cmd) => cmd.command === commandInput.split(" ")[0]
    );
    if (command) {
      const params = commandInput.split(" ").slice(1).join(" ");
      if (command.action === "addTask") {
        toggleTaskMenu();
      } else if (command.action === "deleteTask") {
        deleteTaskByName(params);
      }
      setInputValue(""); // Clear input value after executing command
      setIsActionMode(false); // Reset action mode
    } else {
      // Check if the input is a task
      const task = tasks.find((task) => task.title === commandInput);
      if (task) {
        // Propose additional actions for the task
        setSuggestions([
          {
            title: `Delete the task "${task.title}"`,
            action: "deleteTask",
            id: `delete-${task.id}`,
          },
          {
            title: `Rename the task "${task.title}"`,
            action: "renameTask",
            id: `rename-${task.id}`,
          },
          {
            title: `Update the task "${task.title}"`,
            action: "updateTask",
            id: `update-${task.id}`,
          },
        ]);
        setIsActionMode(true); // Set action mode
      }
    }
  };

  const handleActionSelect = (actionItem) => {
    const { action, id } = actionItem;
    if (action === "deleteTask") {
      // Add delete logic here
    } else if (action === "renameTask") {
      // Add rename logic here
    } else if (action === "updateTask") {
      toggleTaskMenu(id.split("-")[1]);
    }
    setInputValue(""); // Clear input value after executing action
    toggleSearchMenu();
  };

  return (
    <>
      <Blur
        trigger={toggleSearchMenu}
        show={isSearchMenuOpen}
        showZ="50"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      />
      <Div
        styles={`border-none bg-white glass-morphism w-[40vw] flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 rounded-[0.75vw] z-[300] ${
          visibility ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex-col py-1">
          <div className="flex justify-between py-1 px-[3%]">
            <SearchMenuLibelle>{pageName}</SearchMenuLibelle>
            <SearchMenuLibelle styles="text-blue">Ctrl + K</SearchMenuLibelle>
          </div>
          <Downshift
            inputValue={inputValue}
            onInputValueChange={handleInputChange}
            onSelect={(selection) =>
              selection.action
                ? handleActionSelect(selection)
                : executeCommand(selection.title || selection.command)
            }
            itemToString={(item) => (item ? item.title || item.command : "")}
          >
            {({
              getInputProps,
              getItemProps,
              getMenuProps,
              isOpen,
              highlightedIndex,
              selectedItem,
            }) => (
              <div>
                <input
                  {...getInputProps({
                    ref: inputRef,
                    onKeyDown: handleKeyDown,
                    placeholder: "Type a command (/) or search a task...",
                    className:
                      "bg-transparent w-full my-[1.5%] text-black placeholder:text-black px-[3%] text-xl focus:outline-none",
                  })}
                />
                <hr className="h-[1.5%] my-[1%] bg-[rgba(0,0,0,0.5)]" />
                <TransitionGroup
                  component="ul"
                  {...getMenuProps()}
                  className="flex flex-col scroll-hide overflow-y-auto py-1 px-[3%] gap-[2%] transition-all duration-300"
                >
                  {isOpen &&
                    suggestions.map((item, index) => (
                      <CSSTransition
                        key={item.id || index}
                        timeout={300}
                        classNames="fade"
                      >
                        <li
                          {...getItemProps({
                            key: item.id || index,
                            index,
                            item,
                            style: {
                              fontSize: "1.2rem",
                              backgroundColor:
                                highlightedIndex === index
                                  ? "lightgray"
                                  : "white",
                              fontWeight:
                                selectedItem === item ? "bold" : "normal",
                            },
                            onClick: () => {
                              if (item.action) {
                                handleActionSelect(item);
                              } else {
                                executeCommand(item.title || item.command);
                              }
                            },
                          })}
                        >
                          {item.title || item.command}
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </div>
            )}
          </Downshift>
        </div>
      </Div>
    </>
  );
}
// je dois handle les sélections des actions qui s'affichent lorsque l'on clique sur la task
// est-ce vraiment scalable ???
