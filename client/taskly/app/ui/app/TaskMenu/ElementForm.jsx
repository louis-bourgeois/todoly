import { useUserPreferences } from "../../../../context/UserPreferencesContext";

export default function ElementForm({ transitionStyles, id, visibility }) {
  const { preferences } = useUserPreferences();
  const { setActiveTask, addTask, modifyTask, deleteTask, tasks } = useTask();
  const [task, setTask] = useState(null);
  const [titleValue, setTitleValue] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState(undefined);
  const [taskTags, setTaskTags] = useState([]);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [taskWorkspace, setTaskWorkspace] = useState("");
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [sectionSelectMenuOpen, setSectionSelectMenuOpen] = useState(false);
  const [elementPickerMenuOpen, setElementPickerMenuOpen] = useState(false);

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
            ?.name
        );
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
    }
  }, [id]);

  useEffect(() => {
    if (linked_section) {
      console.log("update:", linked_section);
      updateUserPreference({ key: "Last_Section", value: linked_section });
    }
  }, [linked_section]);

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetTaskMenu();
    }
  }, [isTaskMenuOpen]);
  const resetTaskMenu = () => {
    setTaskWorkspace("");
    setTitleValue("");
    setStatus("todo");
    setLinked_section("Other");
    setLinked_section_name(
      sections.find((section) => section.id === preferences.Last_Section)?.name
    );
    setPriority(5);
    setDueDate(undefined);
    setTaskTags([]);
    setDescriptionValue("");
    setActiveTask(null);
    setTask(null);
    setElementPickerMenuOpen(false);
    setSectionSelectMenuOpen(false);
    setElementType("Task");
    setCallback("");
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
    <div className={`w-full h-full flex ${transitionStyles}`}>
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
            />
            <SectionSelection
              linked_section_name={linked_section_name}
              setLinked_section={setLinked_section}
              setLinked_section_name={setLinked_section_name}
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
              <span>{id ? "Delete" : "Create"}</span>
            </TaskMenuButton>
          </div>
        </div>
      </div>
    </div>
  );
}
