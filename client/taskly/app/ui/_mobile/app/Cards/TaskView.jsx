import { useCallback, useEffect, useState } from "react";
import { useError } from "../../../../../context/ErrorContext";
import { useTask } from "../../../../../context/TaskContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import DatePicker from "../MenuLayouts/Task/DatePicker";
import PriorityCounter from "../MenuLayouts/Task/PriorityCounter";
import TagManager from "../MenuLayouts/Task/TagManager";
import TaskLayoutDescription from "../MenuLayouts/Task/TaskLayoutDescription";
import TaskLayoutFooter from "../MenuLayouts/Task/TaskLayoutFooter";
import TaskLayoutHeader from "../MenuLayouts/Task/TaskLayoutHeader";

export default function TaskView({ id }) {
  const { tasks, modifyTask } = useTask();
  const { workspaces } = useWorkspace();
  const { handleError } = useError();

  const [task, setTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkedSection, setLinkedSection] = useState([]);
  const [workspaceId, setWorkspaceId] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [priority, setPriority] = useState(5);

  useEffect(() => {
    const foundTask = tasks.find((t) => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setTaskTitle(foundTask.title || "");
      setDescription(foundTask.description || "");
      setLinkedSection(foundTask.linked_section || "");
      setWorkspaceId(foundTask.workspace_id || "");
      setStatus(foundTask.status || "");
      setDueDate(foundTask.due_date || null);
      setTags(foundTask.tags || []);
      setPriority(foundTask.priority || 5);
    }
  }, [id, tasks]);

  const handlemodifyTask = useCallback(async () => {
    if (task) {
      const updatedTask = {
        ...task,
        title: taskTitle,
        description: description,
        linked_section: linkedSection,
        workspace_id: workspaceId,
        status: status,
        due_date: dueDate,
        tags: JSON.stringify(tags),
        priority: priority,
      };
      try {
        await modifyTask(updatedTask);
        console.log("Task updated successfully");
        // Vous pouvez ajouter ici une notification ou un message de succès
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

  const handleTagsChange = useCallback(async (newTags) => {
    setTags(newTags);
  }, []);

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
  };

  if (!task) {
    return <div>The requested task is not available at this time</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <TaskLayoutHeader
          taskTitle={taskTitle}
          setTaskTitle={setTaskTitle}
          handleTaskClick={handlemodifyTask}
          buttonLabel="Update"
          isEditMode={true}
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
      />{" "}
      <DatePicker dueDate={dueDate} handleDateChange={handleDateChange} />
      <PriorityCounter priority={priority} setPriority={setPriority} />
      <TaskLayoutFooter
        status={status}
        setStatus={setStatus}
        selectedSection={linkedSection || ""}
        setSelectedSection={(sectionId) => setLinkedSection([sectionId])}
        selectedWorkspace={workspaceId}
        setSelectedWorkspace={setWorkspaceId}
      />
    </>
  );
}
