import { addDays, format, getDate } from "date-fns";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../../../context/MenuContext"; // Import useMenu
import { useWorkspace } from "../../../../context/WorkspaceContext";
import { convertDateObjIntoDueDateType } from "../../../utils/utils";

const DateHeader = ({ index, onDateChange }) => {
  const { setCurrentWorkspace, currentWorkspace, workspaces } = useWorkspace();
  const { toggleViewsMenu } = useMenu(); // Use toggleViewsMenu from useMenu

  const { futureDate, dayLabel, dateNumber } = useMemo(() => {
    const today = new Date();
    const futureDate = addDays(today, index);
    const dayLabel =
      index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;
    const dateNumber = getDate(futureDate);
    return { futureDate, dayLabel, dateNumber };
  }, [index]);

  const [currentHour, setCurrentHour] = useState(new Date());
  const [workspacesName, setWorkspacesName] = useState(
    workspaces.map((workspace) => workspace.name)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedHour = useMemo(
    () => format(currentHour, "HH:mm"),
    [currentHour]
  );

  useEffect(() => {
    setWorkspacesName(workspaces.map((workspace) => workspace.name));
  }, [workspaces]);

  const handleCurrentWorkspaceDropdownClick = (name) => {
    const workspace = workspaces.find((workspace) => workspace.name === name);
    if (workspace) setCurrentWorkspace(workspace.id);
    setMenuOpen((prev) => !prev);
  };

  const prevFutureDateRef = useRef();
  useEffect(() => {
    if (onDateChange && futureDate !== prevFutureDateRef.current) {
      onDateChange(convertDateObjIntoDueDateType(futureDate));
      prevFutureDateRef.current = futureDate;
    }
  }, [futureDate, onDateChange]);

  const dateOptions = useMemo(() => ({ weekday: "long" }), []);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex w-full justify-between items-center">
      <h2 className="select-none text-3xl font-extralight">
        {(dateNumber < 10 ? "0" : "") + dateNumber}
      </h2>
      <h2 className="select-none text-3xl font-bold">
        {dayLabel || format(futureDate, "EEEE", dateOptions)}
      </h2>
      <div className="flex items-center gap-[0.7vw] relative">
        {" "}
        <button
          onClick={toggleViewsMenu} // Trigger viewsMenu toggle
          className="mr-4 p-2 rounded-full hover:bg-dominant hover:bg-opacity-10 transition-colors duration-200 w-[50%] flex justify-between"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-dominant"
          >
            <path
              d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <div
          className="addMenuElement cursor-pointer rounded-full flex items-center justify-between p-[1vw]"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {workspaces.find((workspace) => workspace.id === currentWorkspace)
            ?.name || ""}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-2 transition-transform duration-500 ${
              menuOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 29 29"
            width="24"
            height="24"
          >
            <path
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="2.5"
              d="m20.5 11.5-6 6-6-6"
            />
          </svg>
        </div>
        <span className="select-none text-xl">{formattedHour}</span>
        <div
          className={`absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg transition-opacity duration-300 z-50 w-full ${
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-2 text-center text-gray-500 flex flex-col items-start">
            {workspacesName.map((name, index) => (
              <button
                key={index}
                onClick={() => handleCurrentWorkspaceDropdownClick(name)}
                className="hover:text-dominant transition-colors duration-300"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DateHeader);
