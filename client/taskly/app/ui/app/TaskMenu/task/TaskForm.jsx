"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
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
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { setActiveTask, addTask, modifyTask, deleteTask, tasks } = useTask();
  const { updatePreference, preferences } = useUserPreferences();
  const { sections } = useSection();
  const today = new Date();
  const [dueDate, setDueDate] = useState(today);
  const [task, setTask] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(5);

  const [taskTags, setTaskTags] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [linked_section, setLinked_section] = useState("");

  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [sectionSelectMenuOpen, setSectionSelectMenuOpen] = useState(false);
  const [elementPickerMenuOpen, setElementPickerMenuOpen] = useState(false);
  const [linked_section_name, setLinked_section_name] = useState("");
  const [taskWorkspace, setTaskWorkspace] = useState("");
  useEffect(() => {
    setCanSubmit(
      currentWorkspace &&
        titleValue.length > 0 &&
        linked_section &&
        status &&
        0 < priority < 11
    );
  }, [titleValue, linked_section, status, priority, currentWorkspace]);
  useEffect(() => {
    if (id) {
      const foundTask = tasks.find((task) => task.id === id);
      if (foundTask) {
        setTask(foundTask);
        setTitleValue(foundTask.title || "");
        setStatus(foundTask.status || "todo");
        setLinked_section(foundTask.linked_section || "");
        setPriority(foundTask.priority || 5);
        setDueDate(foundTask.due_date);
        const parsedTags = foundTask.tags ? JSON.parse(foundTask.tags) : [];
        setTaskTags(parsedTags);
        setDescriptionValue(foundTask.description || "");
        setCanSubmit(true);
        setTaskWorkspace(foundTask.workspace_id);
      }
    } else {
      setCanSubmit(false);
      // Set default linked_section from preferences only when creating a new task
      const workspaceSection = sections.find(
        (s) => s.id === preferences.Last_Section
      )?.workspace_id;
      if (!(workspaceSection && currentWorkspace !== workspaceSection)) {
        if (!sections.find((s) => s.id === preferences.Last_Section)) {
          const alternativeSection = sections.find(
            (s) => s.name === "Other" && s.workspace_id === currentWorkspace
          )?.id;
          console.log(alternativeSection);
          setLinked_section(alternativeSection);
        } else {
          setLinked_section(preferences.Last_Section || "");
        }
      } else {
        setLinked_section(
          sections.find(
            (s) => s.name === "Other" && s.workspace_id === currentWorkspace
          )?.id || ""
        );
      }
    }
  }, [id, tasks, preferences.Last_Section, currentWorkspace, sections]);

  useEffect(() => {
    if (linked_section) {
      const sectionName = sections.find((s) => s.id === linked_section)?.name;
      setLinked_section_name(sectionName || "");
    }
  }, [linked_section, sections]);

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetTaskMenu();
    }
  }, [isTaskMenuOpen]);

  const resetTaskMenu = () => {
    setTaskWorkspace("");
    setTitleValue("");
    setStatus("todo");
    setPriority(5);
    setDueDate(today);
    setTaskTags([]);
    setDescriptionValue("");
    setActiveTask(null);
    setTask(null);
    setElementPickerMenuOpen(false);
    setSectionSelectMenuOpen(false);
  };

  const handleDateSelect = (date) => {
    if (
      dueDate &&
      format(dueDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    ) {
      setDueDate(undefined);
    } else {
      setDueDate(date);
    }

    if (id) {
      const updatedTask = { ...task, due_date: date || null }; // Enregistre `null` si la date est déselectionnée
      setTask(updatedTask);
      //modifyTask(updatedTask, "post");
    }
  };

  const createTask = async () => {
    try {
      const taskData = {
        title: titleValue,
        status,
        linked_section,
        priority,
        dueDate,
        tags: JSON.stringify(taskTags),
        description: descriptionValue,
        workspaceId: currentWorkspace,
      };
      await addTask(taskData);
      // Update preference after successful task creation
      updatePreference({ key: "Last_Section", value: linked_section });
    } catch (error) {
      console.error(error);
    }
  };

  const delTask = () => {
    try {
      deleteTask(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSectionChange = (newSection, newSectionName) => {
    setLinked_section(newSection);
    setLinked_section_name(newSectionName);
    updatePreference({ key: "Last_Section", value: newSection });
    if (id) {
      const updatedTask = { ...task, linked_section: newSection };
      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    }
  };

  return (
    <div className={`w-full h-full flex ${transitionStyles}`}>
      <div className="flex flex-col w-[30%] rounded-l-[3.125vw] my-[1.4290277778vh] justify-left">
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
          } h-[75%] rounded-bl-[3.125vw] pr-[5%] rounded-[20px] justify-end gap-[8.6%] z-[250]`}
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

      <div className="flex flex-col w-[70%] justify-between my-[1.4290277778vh] rounded-tr-[3.125vw]">
        <div className="flex items-center justify-between h-[57%]">
          <TaskMenuSectionContainer
            flex={false}
            othersStyles="flex flex-col justify-between items-center w-[55%] h-full"
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
              menuOpen={workspaceMenuOpen}
              setMenuOpen={setWorkspaceMenuOpen}
              taskWorkspace={taskWorkspace}
            />
            <SectionSelection
              linked_section_name={linked_section_name}
              handleSectionChange={handleSectionChange}
              id={id}
              task={task}
              setTask={setTask}
              menuOpen={sectionSelectMenuOpen}
              setMenuOpen={setSectionSelectMenuOpen}
            />
          </div>
        </div>
        <div className="flex justify-left h-[40%] pt-[2%]">
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
              onClick={() => {
                id ? delTask() : createTask();
                toggleTaskMenu(!isTaskMenuOpen);
              }}
              moreRoundedCorners="br"
              othersStyles={`w-full h-[25%] items-center justify-left font-bold text-4xl`}
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
