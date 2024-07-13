import { useTask } from "../../../../context/TaskContext";
import { useUser } from "../../../../context/UserContext";
import { Counter } from "./note/Counter";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";

export default function PrioritySelection({
  visibility,
  id,
  setTask,
  task,
  priority,
  setPriority,
}) {
  const { modifyTask } = useTask();
  const handlePriorityChange = (value) => {
    setPriority(value);
    if (id) {
      const updatedTask = { ...task, priority: value };
      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    }
  };

  return (
    <TaskMenuSectionContainer
      flex={true}
      othersStyles={`w-full h-[70%] items-center`}
    >
      <h2 className="font-bold text-4xl p-[2%]">Priority</h2>

      <div className="h-[70%] flex w-full justify-center items-center">
        {visibility && (
          <Counter
            visibility={visibility}
            onChange={(value) => handlePriorityChange(value)}
            initialCount={priority}
          />
        )}
      </div>
    </TaskMenuSectionContainer>
  );
}
