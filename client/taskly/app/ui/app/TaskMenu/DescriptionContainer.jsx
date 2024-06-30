import { useUser } from "../../../../context/UserContext";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";

export default function DescriptionContainer({
  id,
  descriptionValue,
  setDescriptionValue,
  task,
  setTask,
}) {
  const { modifyTask } = useUser();
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
      othersStyles="font-bold text-4xl w-[55%]"
    >
      <h2 className="pb-0 p-[2%]">Description</h2>
      <textarea
        style={{ resize: "none", outline: "none" }}
        name="description"
        value={descriptionValue}
        onChange={(e) => handleDescriptionChange(e)}
        className="h-[80%] p-[2.5%] w-full text-base pt-[4%] bg-transparent"
        placeholder="Enter a description"
      ></textarea>
    </TaskMenuSectionContainer>
  );
}
