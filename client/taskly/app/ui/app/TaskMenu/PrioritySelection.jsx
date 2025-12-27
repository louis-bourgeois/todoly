import { useTask } from "../../../../context/TaskContext";
import { Counter } from "./note/Counter";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";
import { useTranslation } from "../../../i18n/client";

export default function PrioritySelection({
  visibility,
  id,
  setTask,
  task,
  priority,
  setPriority,
  containerStyles = "w-full h-[70%] items-center",
}) {
  const { modifyTask } = useTask();
  const { t } = useTranslation();
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
      othersStyles={containerStyles}
    >
      <h2 className="font-bold text-2xl p-[2%] text-text select-none">{t('prioritySelection.title')}</h2>

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
