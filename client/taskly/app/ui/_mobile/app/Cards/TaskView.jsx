import { useCallback, useEffect, useState } from "react";
import { useError } from "../../../../../context/ErrorContext";
import { useMenu } from "../../../../../context/MenuContext";
import { useTask } from "../../../../../context/TaskContext";
import DatePicker from "../MenuLayouts/Task/DatePicker";
import PriorityCounter from "../MenuLayouts/Task/PriorityCounter";
import TagManager from "../MenuLayouts/Task/TagManager";
import TaskLayoutDescription from "../MenuLayouts/Task/TaskLayoutDescription";
import TaskLayoutFooter from "../MenuLayouts/Task/TaskLayoutFooter";
import TaskLayoutHeader from "../MenuLayouts/Task/TaskLayoutHeader";
const capitalize = (str) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export default function TaskView({ id }) {
  const { tasks, modifyTask, deleteTask } = useTask();
  const { handleError } = useError();
  const [lastUrlSegment, setLastUrlSegment] = useState("");
  const [task, setTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkedSection, setLinkedSection] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const { cardType, setCardType } = useMenu();
  const [priority, setPriority] = useState(5);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setTaskTitle(foundTask.title || "");
      setDescription(foundTask.description || "");
      setLinkedSection(foundTask.linked_section || []);
      setWorkspaceId(foundTask.workspace_id || "");
      setStatus(foundTask.status || "");
      setDueDate(foundTask.due_date || null);
      setTags(foundTask.tags || []);
      setPriority(foundTask.priority || 5);
    }
  }, [id, tasks]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split("/");
      setLastUrlSegment(segments[segments.length - 1]);
    }
  }, [cardType]);

  const handleModifyTask = useCallback(async () => {
    if (task) {
      const updatedTask = {
        ...task,
        title: taskTitle,
        description: description,
        linked_section: linkedSection,
        workspace_id: workspaceId,
        status: status,
        due_date: dueDate,
        tags: tags,
        priority: priority,
      };
      try {
        await modifyTask(updatedTask);
        console.log("Task updated successfully");
        // You can add a notification or success message here
        setCardType(capitalize(lastUrlSegment));
      } catch (error) {
        console.error("Failed to update task", error);
        handleError(error);
      }
    }
  }, [
    task,
    taskTitle,
    description,
    linkedSection,
    workspaceId,
    status,
    dueDate,
    tags,
    priority,
    modifyTask,
    handleError,
  ]);

  const handleTagsChange = useCallback((newTags) => {
    setTags(newTags);
  }, []);

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleDeleteTask = useCallback(async () => {
    try {
      if (id) {
        await deleteTask(id);
        setCardType(capitalize(lastUrlSegment));
      } else {
        console.error("id is not defined");
      }
    } catch (error) {
      console.error("Error in handleDeleteTask:", error);
      handleError(error);
    }
  }, [id, lastUrlSegment, setCardType, deleteTask, handleError]);

  if (!task) {
    return <div>The requested task is not available at this time</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <TaskLayoutHeader
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          handleTaskClick={handleModifyTask}
          buttonLabel="Update"
          isEditMode={true}
          handleDeleteTask={handleDeleteTask}
          lastUrlSegment={lastUrlSegment}
        />
        <TaskLayoutDescription
          taskDescription={description}
          setTaskDescription={setDescription}
        />
      </div>
      <TagManager
        taskTags={tags}
        setTaskTags={setTags}
        handleTagsChange={handleTagsChange}
      />
      <DatePicker dueDate={dueDate} handleDateChange={handleDateChange} />
      <PriorityCounter priority={priority} setPriority={setPriority} />
      <TaskLayoutFooter
        status={status}
        setStatus={setStatus}
        selectedSection={linkedSection[0] || ""}
        setSelectedSection={(sectionId) => setLinkedSection([sectionId])}
        selectedWorkspace={workspaceId}
        setSelectedWorkspace={setWorkspaceId}
      />
    </>
  );
}
