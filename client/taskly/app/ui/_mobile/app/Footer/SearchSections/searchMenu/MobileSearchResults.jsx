import { useRouter } from "next/navigation";
import { useMenu } from "../../../../../../../context/MenuContext";
import { useMobileSearch } from "../../../../../../../context/searchContext";

export default function MobileSearchResults() {
  const router = useRouter();
  const { toggleTaskMenu } = useMenu();
  const {
    suggestions,
    commandMode,
    selectedTask,
    setSelectedTask,
    setCommandMode,
    setSearchQuery,
    selectedIndex,
  } = useMobileSearch();

  if (suggestions.length === 0) {
    return null;
  }

  const handleItemClick = (item) => {
    if (commandMode === "command") {
      handleCommand(item.id);
    } else if (selectedTask) {
      handleTaskAction(item.id);
    } else {
      setSelectedTask(item);
    }
  };

  const handleCommand = (commandId) => {
    switch (commandId) {
      case "add":
        // TODO: Implement open add menu logic
        console.log("Open add menu");
        break;
      case "goto":
        setCommandMode("goto");
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
      case "changeWorkspace":
      case "deleteWorkspace":
        setCommandMode(commandId);
        setSearchQuery("");
        break;
      case "addTag":
        setCommandMode("addTag");
        setSearchQuery("");
        break;
    }
  };

  const handleTaskAction = (actionId) => {
    switch (actionId) {
      case "update":
        toggleTaskMenu(selectedTask.id, "", "Task");
        break;
      case "delete":
        // TODO: Implement delete task logic
        console.log("Delete task:", selectedTask.title);
        break;
    }
    setSelectedTask(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col p-5">
      <h2 className="text-xl font-bold">Results: </h2>
      <div className="mt-2 bg-primary rounded-lg max-h-[60vh] overflow-y-auto">
        <ul className="py-2">
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                index === selectedIndex ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
