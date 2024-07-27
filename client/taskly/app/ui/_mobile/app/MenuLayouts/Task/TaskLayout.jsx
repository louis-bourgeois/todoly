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
    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split("/");
      setLastUrlSegment(segments[segments.length - 1]);
    }
  }, [cardType]);

  const handleTaskClick = useCallback(async () => {
    if (id) {
      return;
    }

    setCardType(capitalize(lastUrlSegment));
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
    console.log("====================================");
    console.log(taskData);
    console.log("====================================");
    await addTask(taskData);
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
  ]);

  const handleTagsChange = useCallback(
    async (newTags) => {
      if (id && newTags) {
        const updatedTask = { ...task, tags: JSON.stringify(newTags) };
        setTask(updatedTask);
        try {
          await modifyTask(updatedTask);
        } catch (error) {
          console.error("Failed to update task", error);
          handleError(error);
        }
      }
    },
    [id, task, modifyTask, handleError]
  );

  const handleDateChange = (e) => {
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
