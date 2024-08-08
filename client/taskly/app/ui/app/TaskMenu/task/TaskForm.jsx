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

  const [formState, setFormState] = useState({
    dueDate: new Date(),
    task: null,
    titleValue: "",
    status: "todo",
    priority: 5,
    taskTags: [],
    descriptionValue: "",
    canSubmit: false,
    linked_section: "",
    linked_section_name: "",
    taskWorkspace: "",
  });

  const updateFormState = useCallback((updates) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

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
        updateFormState({
          task: foundTask,
          titleValue: foundTask.title || "",
          status: foundTask.status || "todo",
          linked_section: foundTask.linked_section || "",
          priority: foundTask.priority || 5,
          dueDate: foundTask.due_date
            ? new Date(foundTask.due_date)
            : new Date(),
          taskTags: foundTask.tags || [],
          descriptionValue: foundTask.description || "",
          canSubmit: true,
          taskWorkspace: foundTask.workspace_id || "",
        });
      }
    } else {
      updateFormState({
        canSubmit: false,
        linked_section: getDefaultSection(),
        titleValue: "",
        status: "todo",
        priority: 5,
        dueDate: new Date(),
        taskTags: [],
        descriptionValue: "",
        taskWorkspace: currentWorkspace || "",
      });
    }
  }, [id, tasks, getDefaultSection, updateFormState, currentWorkspace]);

  useEffect(() => {
    const { titleValue, linked_section, priority } = formState;
    updateFormState({
      canSubmit:
        currentWorkspace &&
        titleValue &&
        titleValue.length > 0 &&
        linked_section &&
        priority &&
        priority > 0 &&
        priority < 11,
    });
  }, [
    formState.titleValue,
    formState.linked_section,
    formState.priority,
    currentWorkspace,
    updateFormState,
  ]);

  useEffect(() => {
    if (formState.linked_section) {
      const sectionName = sections.find(
        (s) => s.id === formState.linked_section
      )?.name;
      if (sectionName && sectionName !== formState.linked_section_name) {
        updateFormState({ linked_section_name: sectionName });
      }
    } else if (formState.linked_section_name !== "") {
      updateFormState({ linked_section_name: "" });
    }
  }, [
    formState.linked_section,
    sections,
    formState.linked_section_name,
    updateFormState,
  ]);

  const resetTaskMenu = useCallback(() => {
    updateFormState({
      taskWorkspace: currentWorkspace || "",
      titleValue: "",
      status: "todo",
      priority: 5,
      dueDate: new Date(),
      taskTags: [],
      descriptionValue: "",
      task: null,
      elementPickerMenuOpen: false,
      sectionSelectMenuOpen: false,
      linked_section: getDefaultSection(),
    });
    setActiveTask(null);
  }, [setActiveTask, updateFormState, currentWorkspace, getDefaultSection]);

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetTaskMenu();
    }
  }, [isTaskMenuOpen, resetTaskMenu]);

  const handleDateSelect = useCallback(
    (date) => {
      if (
        formState.dueDate &&
        format(formState.dueDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ) {
        updateFormState({ dueDate: undefined });
      } else {
        updateFormState({ dueDate: date });
      }

      if (id) {
        const updatedTask = { ...formState.task, due_date: date || null };
        updateFormState({ task: updatedTask });
      }
    },
    [formState.dueDate, formState.task, id, updateFormState]
  );

  const createTask = useCallback(async () => {
    try {
      const taskData = {
        title: formState.titleValue,
        status: formState.status,
        linked_section: formState.linked_section,
        priority: formState.priority,
        dueDate: formState.dueDate,
        tags: formState.taskTags,
        description: formState.descriptionValue,
        workspaceId: currentWorkspace,
      };
      await addTask(taskData);
      updatePreference({
        key: "Last_Section",
        value: formState.linked_section,
      });
      toggleTaskMenu(false);
    } catch (error) {
      console.error(error);
    }
  }, [formState, currentWorkspace, addTask, updatePreference, toggleTaskMenu]);

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
      updateFormState({
        linked_section: newSection,
        linked_section_name: newSectionName,
      });
      updatePreference({ key: "Last_Section", value: newSection });
      if (id) {
        const updatedTask = { ...formState.task, linked_section: newSection };
        updateFormState({ task: updatedTask });
        modifyTask(updatedTask, "post");
      }
    },
    [formState.task, id, modifyTask, updateFormState, updatePreference]
  );
  useEffect(() => {
    console.log("taskTags in TaskForm:", formState.taskTags);
  }, [formState.taskTags]);
  return (
    <div className={`w-full h-full flex ${transitionStyles}`}>
      <div className="flex flex-col w-[30%] rounded-l-[3.125vw] justify-left">
        <TitleInput
          id={id}
          visibility={visibility}
          titleValue={formState.titleValue}
          setTitleValue={(value) => updateFormState({ titleValue: value })}
          task={formState.task}
          setTask={(task) => updateFormState({ task })}
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
            setTask={(task) => updateFormState({ task })}
            taskTags={formState.taskTags}
            setTaskTags={(tags) => updateFormState({ taskTags: tags })}
            task={formState.task}
          />
        </div>
      </div>

      <div className="flex flex-col w-[70%] justify-between rounded-tr-[3.125vw]">
        <div className="flex items-center justify-between h-[57%]">
          <TaskMenuSectionContainer
            flex={false}
            othersStyles="flex flex-col justify-between items-center w-[55%] h-full"
          >
            <DatePicker
              onDateSelect={handleDateSelect}
              selectedDate={
                formState.dueDate
                  ? format(formState.dueDate, "yyyy-MM-dd")
                  : undefined
              }
              startOfWeekOnSunday={preferences.Week_Starts_On}
            />
          </TaskMenuSectionContainer>
          <div className="flex flex-col w-full h-full justify-between ml-[2%] z-[300]">
            <WorkspaceSelect
              handleNewWorkspaceClick={handleElementTypeChange}
              setTask={(task) => updateFormState({ task })}
              task={formState.task}
              id={id}
              menuOpen={workspaceSelectMenuOpen}
              setMenuOpen={setWorkspaceSelectMenuOpen}
              taskWorkspace={formState.taskWorkspace}
            />
            <SectionSelection
              linked_section_name={formState.linked_section_name}
              handleSectionChange={handleSectionChange}
              id={id}
              task={formState.task}
              setTask={(task) => updateFormState({ task })}
              menuOpen={sectionSelectMenuOpen}
              setMenuOpen={setSectionSelectMenuOpen}
            />
          </div>
        </div>
        <div className="flex justify-left h-[40%]">
          <DescriptionContainer
            id={id}
            descriptionValue={formState.descriptionValue}
            setDescriptionValue={(value) =>
              updateFormState({ descriptionValue: value })
            }
            task={formState.task}
            setTask={(task) => updateFormState({ task })}
            priority={formState.priority}
            setPriority={(priority) => updateFormState({ priority })}
          />

          <div className="flex flex-col justify-between w-[45%] ml-[2%]">
            <PrioritySelection
              visibility={true}
              id={id}
              setTask={(task) => updateFormState({ task })}
              task={formState.task}
              priority={formState.priority}
              setPriority={(priority) => updateFormState({ priority })}
            />
            <TaskMenuButton
              disabled={!formState.canSubmit}
              onClick={() => (id ? delTask() : createTask())}
              moreRoundedCorners="br"
              othersStyles={`w-full h-[25%] items-center justify-left font-bold text-4xl text-text`}
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
