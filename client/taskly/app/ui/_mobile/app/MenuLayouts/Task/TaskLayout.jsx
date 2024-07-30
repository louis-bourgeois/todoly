import { useCallback, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { useError } from "../../../../../../context/ErrorContext";
import { useMenu } from "../../../../../../context/MenuContext";
import { useTask } from "../../../../../../context/TaskContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import DatePicker from "./DatePicker";
import PriorityCounter from "./PriorityCounter";
import TagManager from "./TagManager";
import TaskLayoutDescription from "./TaskLayoutDescription";
import TaskLayoutFooter from "./TaskLayoutFooter";
import TaskLayoutHeader from "./TaskLayoutHeader";

const capitalize = (str) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function TaskLayout({ id }) {
  const [taskTitle, setTaskTitle] = useState("");
  const { currentWorkspace } = useWorkspace();
  const [taskDescription, setTaskDescription] = useState("");
  const [task, setTask] = useState();
  const { setCardType, cardType } = useMenu();
  const [taskTags, setTaskTags] = useState([]);
  const [status, setStatus] = useState("To Do");
  const { modifyTask, addTask, deleteTask } = useTask();
  const { handleError } = useError();
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [lastUrlSegment, setLastUrlSegment] = useState("");

  useEffect(() => {
    function updateLastUrlSegment() {
      if (typeof window !== "undefined") {
        const segments = window.location.pathname.split("/");
        const newLastSegment = segments[segments.length - 1] || "home";
        console.log("New last URL segment:", newLastSegment);
        setLastUrlSegment(newLastSegment);
      }
    }

    // Initial update
    updateLastUrlSegment();

    // Listen for changes in the URL
    window.addEventListener("popstate", updateLastUrlSegment);

    // Cleanup
    return () => window.removeEventListener("popstate", updateLastUrlSegment);
  }, []);

  useEffect(() => {
    console.log("lastUrlSegment updated:", lastUrlSegment);
  }, [lastUrlSegment]);

  useEffect(() => {
    console.log("cardType changed:", cardType);
  }, [cardType]);

  const handleTaskClick = useCallback(async () => {
    if (id) {
      console.log("Task already exists, id:", id);
      return;
    }
    console.log("Creating new task with lastUrlSegment:", lastUrlSegment);
    const newCardType = capitalize(lastUrlSegment);
    if (taskTitle.length > 0 && selectedSection && currentWorkspace && status) {
      console.log("Setting new cardType:", newCardType);
      setCardType(newCardType);
      const taskData = {
        title: taskTitle,
        status: status.toLowerCase().replace(/\s+/g, ""),
        linked_section: selectedSection,
        priority,
        dueDate,
        tags: JSON.stringify(taskTags),
        description: taskDescription,
        workspaceId: currentWorkspace,
      };
      console.log("New task data:", taskData);
      try {
        await addTask(taskData);
        console.log("Task added successfully");
      } catch (error) {
        console.error("Failed to add task", error);
        handleError(error);
      }
    }
  }, [
    id,
    lastUrlSegment,
    taskTitle,
    status,
    selectedSection,
    priority,
    dueDate,
    taskTags,
    taskDescription,
    currentWorkspace,
    addTask,
    setCardType,
    handleError,
  ]);

  const handleTagsChange = useCallback(
    async (newTags) => {
      console.log("Handling tags change, new tags:", newTags);
      if (id && newTags) {
        const updatedTask = { ...task, tags: JSON.stringify(newTags) };
        console.log("Updating task with new tags:", updatedTask);
        setTask(updatedTask);
        try {
          await modifyTask(updatedTask);
          console.log("Task updated successfully");
        } catch (error) {
          console.error("Failed to update task", error);
          handleError(error);
        }
      }
    },
    [id, task, modifyTask, handleError]
  );

  const handleDateChange = (e) => {
    console.log("Date changed:", e.target.value);
    setDueDate(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <TaskLayoutHeader
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          handleTaskClick={handleTaskClick}
          isEditMode={!!id}
          disabled={
            !(
              taskTitle.length > 0 &&
              selectedSection &&
              currentWorkspace &&
              status
            )
          }
        />
        <TaskLayoutDescription
          taskDescription={taskDescription}
          setTaskDescription={setTaskDescription}
        />
      </div>
      <TagManager
        taskTags={taskTags}
        setTaskTags={setTaskTags}
        handleTagsChange={handleTagsChange}
      />
      <DatePicker dueDate={dueDate} handleDateChange={handleDateChange} />
      <PriorityCounter priority={priority} setPriority={setPriority} />
      <TaskLayoutFooter
        status={status}
        setStatus={setStatus}
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        selectedWorkspace={selectedWorkspace}
        setSelectedWorkspace={setSelectedWorkspace}
      />
    </>
  );
}
