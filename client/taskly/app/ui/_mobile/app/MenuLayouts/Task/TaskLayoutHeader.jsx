import React from "react";
import Button from "../../Cards/assets/Button";

const TaskLayoutHeader = ({ taskTitle, setTaskTitle, handleTaskClick }) => (
  <div className="flex w-full justify-between items-center pt-2 px-4">
    <input
      type="text"
      value={taskTitle}
      onChange={(e) => setTaskTitle(e.target.value)}
      placeholder="A simple to do."
      className="w-full text-2xl font-bold placeholder:text-2xl placeholder:text-grey focus:outline-none"
    />
    <Button label="Create" dominant={true} onClick={handleTaskClick} />
  </div>
);

export default React.memo(TaskLayoutHeader);
