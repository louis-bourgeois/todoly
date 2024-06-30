import { format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { MenuContext } from "../../../../context/MenuContext";
import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";
import Blur from "../Blur";
import DatePicker from "../DatePicker/DatePicker";
import Div from "../Div";
import DescriptionContainer from "./DescriptionContainer";
import ElementPicker from "./ElementPicker";
import PrioritySelection from "./PrioritySelection";
import SectionSelection from "./SectionSelection";
import TagSelect from "./TagSelect";
import TaskMenuButton from "./TaskMenuButton";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";
import TitleInput from "./TitleInput";
import WorkspaceSelect from "./WorkspaceSelect";

export default function TaskMenu({ visibility, id = null, element = "Task" }) {
  const { addTask, modifyTask, deleteTask, tasks, sections } = useUser();
  const { currentWorkspace } = useWorkspace();
  const { isTaskMenuOpen, toggleTaskMenu } = useContext(MenuContext);
  const { setActiveTask } = useTask();
  const [task, setTask] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [status, setStatus] = useState("todo");
  const [linked_section, setLinked_section] = useState("Other");
  const [linked_section_name, setLinked_section_name] = useState("Other");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState(undefined);
  const [taskTags, setTaskTags] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  const taskMenuRef = useRef(null);

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find((task) => task.id === id);
      if (foundTask) {
        setTask(foundTask);
        setTitleValue(foundTask.title || "");
        setStatus(foundTask.status || "todo");
        setLinked_section(foundTask.linked_section || "Other");
        setLinked_section_name(
          sections.find((section) => section.id === foundTask.linked_section)
            ?.name || "Other"
        );
        setPriority(foundTask.priority || 5);
        setDueDate(foundTask.due_date);
        const parsedTags = foundTask.tags ? JSON.parse(foundTask.tags) : [];
        setTaskTags(parsedTags);
        setDescriptionValue(foundTask.description || "");
        setCanSubmit(true);
      }
    } else {
      setCanSubmit(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetTaskMenu();
    }
  }, [isTaskMenuOpen]);

  const resetTaskMenu = () => {
    setTitleValue("");
    setStatus("todo");
    setLinked_section("Other");
    setLinked_section_name("Other");
    setPriority(5);
    setDueDate(undefined);
    setTaskTags([]);
    setDescriptionValue("");
    setActiveTask(null);
    setTask(null);
  };
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    if (id) {
      const updatedTask = { ...task, priority: value };
      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    }
  };

  const handleDateSelect = (date) => {
    setDueDate(date);
    if (id) {
      const updatedTask = { ...task, due_date: date };

      setTask(updatedTask);
      modifyTask(updatedTask, "post");
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

  return (
    <>
      <Blur
        trigger={toggleTaskMenu}
        show={isTaskMenuOpen}
        showZ="40"
        hideZ="0"
        bg="bg-transparent"
        fullscreen={true}
      />

      <Div
        _id="TaskMenuMain"
        ref={taskMenuRef}
        styles={`glass-morphism flex border gap-[0.5%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[80] fontMenu transition-all duration-300 rounded-[3.125vw] py-[1.5vh] px-[1.3227%] ${
          visibility
            ? "w-[63vw] h-[64vh] opacity-100"
            : "w-0 h-0 opacity-0 pointer-events-none"
        }`}
        notBorder
      >
        <div className="flex flex-col w-[30%] rounded-l-[3.125vw] my-[1.4290277778vh] justify-left">
          <TitleInput
            id={id}
            visibility={visibility}
            titleValue={titleValue}
            setTitleValue={setTitleValue}
            setCanSubmit={setCanSubmit}
            task={task}
            setTask={setTask}
          />

          <div
            className={`${
              id ? "" : " flex flex-col"
            } h-[75%] rounded-bl-[3.125vw] pr-[5%] rounded-[20px] justify-end gap-[8.6%]`}
          >
            {!id && <ElementPicker></ElementPicker>}
            <TagSelect
              id={id}
              setTask={setTask}
              taskTags={taskTags}
              modifyTask={modifyTask}
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
                selectedDate={
                  dueDate ? format(dueDate, "yyyy-MM-dd") : undefined
                }
              />
            </TaskMenuSectionContainer>
            <div className="flex flex-col w-full h-full justify-between ml-[2%] z-[300]">
              <WorkspaceSelect />
              <SectionSelection
                linked_section_name={linked_section_name}
                setLinked_section={setLinked_section}
                setLinked_section_name={setLinked_section_name}
                id={id}
                task={task}
                setTask={setTask}
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
                <span>{id ? "Delete" : "Create"}</span>
              </TaskMenuButton>
            </div>
          </div>
        </div>
      </Div>
    </>
  );
}
