import React from "react";
import Button from "../../Cards/assets/Button";

const TaskLayoutHeader = ({
  taskTitle,
  handleDeleteTask,
  setTaskTitle,
  handleTaskClick,
  isEditMode = false,
  lastUrlSegment = "",
  disabled = false,
}) => {
  return (
    <div className="flex w-full justify-between items-center pt-2 px-4 gap-2">
      <input
        type="text"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="A simple to do."
        className="w-full text-text bg-primary text-2xl font-bold placeholder:text-2xl placeholder:text-grey focus:outline-none"
      />
      <Button
        label={isEditMode ? "Update" : "Create"}
        dominant={true}
        onClick={handleTaskClick}
        disabled={disabled}
      />
      {isEditMode && (
        <button onClick={handleDeleteTask} className="cursor-pointer">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M3 6.98996C8.81444 4.87965 15.1856 4.87965 21 6.98996"
                stroke="#FA3766"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M8.00977 5.71997C8.00977 4.6591 8.43119 3.64175 9.18134 2.8916C9.93148 2.14146 10.9489 1.71997 12.0098 1.71997C13.0706 1.71997 14.0881 2.14146 14.8382 2.8916C15.5883 3.64175 16.0098 4.6591 16.0098 5.71997"
                stroke="#FA3766"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M12 13V18"
                stroke="#FA3766"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
              <path
                d="M19 9.98999L18.33 17.99C18.2225 19.071 17.7225 20.0751 16.9246 20.8123C16.1266 21.5494 15.0861 21.9684 14 21.99H10C8.91389 21.9684 7.87336 21.5494 7.07541 20.8123C6.27745 20.0751 5.77745 19.071 5.67001 17.99L5 9.98999"
                stroke="#FA3766"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>{" "}
            </g>
          </svg>
        </button>
      )}
    </div>
  );
};

export default React.memo(TaskLayoutHeader);
