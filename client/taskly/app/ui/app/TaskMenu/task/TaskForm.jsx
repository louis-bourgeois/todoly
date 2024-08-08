"use client";

import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useMenu } from "../../../../../context/MenuContext";
import { useSection } from "../../../../../context/SectionContext";
import { useTask } from "../../../../../context/TaskContext";
import { useUserPreferences } from "../../../../../context/UserPreferencesContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import DatePicker from "../../DatePicker/DatePicker";
import DescriptionContainer from "../DescriptionContainer";
import PrioritySelection from "../PrioritySelection";
import TaskMenuButton from "../TaskMenuButton";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";
import TitleInput from "../TitleInput";
import ElementPicker from "./ElementPicker";
import SectionSelection from "./SectionSelection";
import TagSelect from "./TagSelect";
import WorkspaceSelect from "./WorkspaceSelect";

export default function TaskForm({
  transitionStyles,
  id,
  visibility,
  elementType,
  handleElementTypeChange,
}) {
  const { isTaskMenuOpen, toggleTaskMenu } = useMenu();
  const { currentWorkspace } = useWorkspace();
  const { setActiveTask, addTask, modifyTask, deleteTask, tasks } = useTask();
  const { updatePreference, preferences } = useUserPreferences();
  const { sections } = useSection();

  const [sectionSelectMenuOpen, setSectionSelectMenuOpen] = useState(false);
  const [workspaceSelectMenuOpen, setWorkspaceSelectMenuOpen] = useState(false);
  const [elementPickerMenuOpen, setElementPickerMenuOpen] = useState(false);

  const [dueDate, setDueDate] = useState(new Date());
  const [task, setTask] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(5);
  const [taskTags, setTaskTags] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [linkedSection, setLinkedSection] = useState("");
  const [linkedSectionName, setLinkedSectionName] = useState("");
  const [taskWorkspace, setTaskWorkspace] = useState("");

  const getDefaultSection = useCallback(() => {
    const workspaceSection = sections.find(
      (s) => s.id === preferences.Last_Section
    )?.workspace_id;
    if (!(workspaceSection && currentWorkspace !== workspaceSection)) {
      if (!sections.find((s) => s.id === preferences.Last_Section)) {
        return (
          sections.find(
            (s) => s.name === "Other" && s.workspace_id === currentWorkspace
          )?.id || ""
        );
      } else {
        return preferences.Last_Section || "";
      }
    } else {
      return (
        sections.find(
          (s) => s.name === "Other" && s.workspace_id === currentWorkspace
        )?.id || ""
      );
    }
  }, [sections, preferences.Last_Section, currentWorkspace]);

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find((task) => task.id === id);
      if (foundTask) {
        setTask(foundTask);
        setTitleValue(foundTask.title || "");
        setStatus(foundTask.status || "todo");
        setLinkedSection(foundTask.linked_section || "");
        setPriority(foundTask.priority || 5);
        setDueDate(
          foundTask.due_date ? new Date(foundTask.due_date) : new Date()
        );
        setTaskTags(foundTask.tags || []);
        setDescriptionValue(foundTask.description || "");
        setCanSubmit(true);
        setTaskWorkspace(foundTask.workspace_id || "");
      }
    } else {
      setCanSubmit(false);
      setLinkedSection(getDefaultSection());
      setTitleValue("");
      setStatus("todo");
      setPriority(5);
      setDueDate(new Date());
      setTaskTags([]);
      setDescriptionValue("");
      setTaskWorkspace(currentWorkspace || "");
    }
  }, [id, tasks, getDefaultSection, currentWorkspace]);

  useEffect(() => {
    setCanSubmit(
      currentWorkspace &&
        titleValue &&
        titleValue.length > 0 &&
        linkedSection &&
        priority &&
        priority > 0 &&
        priority < 11
    );
  }, [titleValue, linkedSection, priority, currentWorkspace]);

  useEffect(() => {
    if (linkedSection) {
      const sectionName = sections.find((s) => s.id === linkedSection)?.name;
      if (sectionName && sectionName !== linkedSectionName) {
        setLinkedSectionName(sectionName);
      }
    } else if (linkedSectionName !== "") {
      setLinkedSectionName("");
    }
  }, [linkedSection, sections, linkedSectionName]);

  const resetTaskMenu = useCallback(() => {
    setTaskWorkspace(currentWorkspace || "");
    setTitleValue("");
    setStatus("todo");
    setPriority(5);
    setDueDate(new Date());
    setTaskTags([]);
    setDescriptionValue("");
    setTask(null);
    setElementPickerMenuOpen(false);
    setSectionSelectMenuOpen(false);
    setLinkedSection(getDefaultSection());
    setActiveTask(null);
  }, [setActiveTask, currentWorkspace, getDefaultSection]);

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetTaskMenu();
    }
  }, [isTaskMenuOpen, resetTaskMenu]);

  const handleDateSelect = useCallback(
    (date) => {
      if (
        dueDate &&
        format(dueDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ) {
        setDueDate(undefined);
      } else {
        setDueDate(date);
      }

      if (id) {
        const updatedTask = { ...task, due_date: date || null };
        setTask(updatedTask);
      }
    },
    [dueDate, task, id]
  );

  const createTask = useCallback(async () => {
    try {
      const taskData = {
        title: titleValue,
        status: status,
        linked_section: linkedSection,
        priority: priority,
        dueDate: dueDate,
        tags: taskTags,
        description: descriptionValue,
        workspaceId: currentWorkspace,
      };
      await addTask(taskData);
      updatePreference({
        key: "Last_Section",
        value: linkedSection,
      });
      toggleTaskMenu(false);
    } catch (error) {
      console.error(error);
    }
  }, [
    titleValue,
    status,
    linkedSection,
    priority,
    dueDate,
    taskTags,
    descriptionValue,
    currentWorkspace,
    addTask,
    updatePreference,
    toggleTaskMenu,
  ]);

  const delTask = useCallback(() => {
    try {
      deleteTask(id);
      toggleTaskMenu(false);
    } catch (e) {
      console.error(e);
    }
  }, [deleteTask, id, toggleTaskMenu]);

  const handleSectionChange = useCallback(
    (newSection, newSectionName) => {
      setLinkedSection(newSection);
      setLinkedSectionName(newSectionName);
      updatePreference({ key: "Last_Section", value: newSection });
      if (id) {
        const updatedTask = { ...task, linked_section: newSection };
        setTask(updatedTask);
        modifyTask(updatedTask, "post");
      }
    },
    [task, id, modifyTask, updatePreference]
  );
  return (
    <div className={`w-full h-full flex ${transitionStyles}`}>
      <div className="flex flex-col w-[30%] rounded-l-[3.125vw] justify-left">
        <TitleInput
          id={id}
          visibility={visibility}
          titleValue={titleValue}
          setTitleValue={setTitleValue}
          task={task}
          setTask={setTask}
        />

        <div
          className={`${
            id ? "" : "flex flex-col"
          } h-[75%] rounded-bl-[3.125vw] pr-[5%] rounded-[20px] justify-end gap-[5%] z-[250]`}
        >
          {!id && (
            <div className="z-[250]">
              <ElementPicker
                elementType={elementType}
                handleElementTypeChange={handleElementTypeChange}
                menuOpen={elementPickerMenuOpen}
                setMenuOpen={setElementPickerMenuOpen}
              />
            </div>
          )}
          <TagSelect
            id={id}
            setTask={setTask}
            taskTags={taskTags}
            setTaskTags={setTaskTags}
            task={task}
          />
        </div>
      </div>

      <div className="flex flex-col w-[70%] justify-between rounded-tr-[3.125vw]">
        <div className="flex items-center justify-between h-[57%]">
          <TaskMenuSectionContainer
            flex={false}
            othersStyles="flex flex-col justify-between items-center  h-full"
            padding="0"
          >
            <DatePicker
              onDateSelect={handleDateSelect}
              selectedDate={dueDate ? format(dueDate, "yyyy-MM-dd") : undefined}
              startOfWeekOnSunday={preferences.Week_Starts_On}
            />
          </TaskMenuSectionContainer>
          <div className="flex flex-col w-full h-full justify-between ml-[2%] z-[300]">
            <WorkspaceSelect
              handleNewWorkspaceClick={handleElementTypeChange}
              setTask={setTask}
              task={task}
              id={id}
              menuOpen={workspaceSelectMenuOpen}
              setMenuOpen={setWorkspaceSelectMenuOpen}
              taskWorkspace={taskWorkspace}
            />
            <SectionSelection
              linked_section_name={linkedSectionName}
              handleSectionChange={handleSectionChange}
              id={id}
              task={task}
              setTask={setTask}
              menuOpen={sectionSelectMenuOpen}
              setMenuOpen={setSectionSelectMenuOpen}
            />
          </div>
        </div>
        <div className="flex justify-left h-[40%]">
          <DescriptionContainer
            id={id}
            descriptionValue={descriptionValue}
            setDescriptionValue={setDescriptionValue}
            task={task}
            setTask={setTask}
            priority={priority}
            setPriority={setPriority}
          />

          <div className="flex flex-col justify-between w-[45%] ml-[2%]">
            <PrioritySelection
              visibility={true}
              id={id}
              setTask={setTask}
              task={task}
              priority={priority}
              setPriority={setPriority}
            />
            <TaskMenuButton
              disabled={!canSubmit}
              onClick={() => (id ? delTask() : createTask())}
              moreRoundedCorners="br"
              othersStyles={`w-full h-[25%] items-center justify-left font-bold text-4xl text-text `}
              flex
            >
              <span className="text-2xl">{id ? "Delete" : "Create"}</span>
            </TaskMenuButton>
          </div>
        </div>
      </div>
    </div>
  );
}
