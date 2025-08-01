import { useTask } from "../../../../context/TaskContext";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";
import { useTranslation } from "../../../i18n/client";

export default function DescriptionContainer({
  id,
  descriptionValue,
  setDescriptionValue,
  task,
  setTask,
}) {
  const { modifyTask } = useTask();
  const { t } = useTranslation();
  const handleDescriptionChange = async (e) => {
    const value = e.target.value;
    setDescriptionValue(value);
    if (id) {
      const updatedTask = { ...task, description: value };

      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    }
  };
  return (
    <TaskMenuSectionContainer
      flex={false}
      othersStyles="font-bold text-2xl text-text w-[55%]"
    >
      <h2 className="pb-0 p-[2%] select-none">{t('descriptionContainer.title')}</h2>
      <textarea
        style={{ resize: "none", outline: "none" }}
        name="description"
        value={descriptionValue}
        onChange={(e) => handleDescriptionChange(e)}
        className="h-[80%] p-[2.5%] w-full text-base font-normal text-text pt-[4%] bg-transparent"
        placeholder={t('descriptionContainer.placeholder')}
      ></textarea>
    </TaskMenuSectionContainer>
  );
}