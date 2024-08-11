import { useState } from "react";

export default function ElementPickerLibelle({
  handleElementTypeChange,
  elementType,
}) {
  const [taskArrowIsClicked, setTaskArrowIsClicked] = useState(false);
  const [elements] = useState(["Task", "Workspace"]);

  return (
    <div
      onClick={() => setTaskArrowIsClicked((prev) => !prev)}
      className="relative bg-dominant cursor-pointer rounded-full p-[1%] py-[0.5%] flex justify-between items-center"
    >
      <span className="pl-[5%] pb-[2%]  text-text">{elementType}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer text-text transition-transform duration-500  ${
          taskArrowIsClicked ? "rotate-180" : ""
        }`}
        viewBox="0 0 29 29"
        width="50"
        height="50"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="m20.5 11.5-6 6-6-6"
        ></path>
      </svg>
      <div
        className={`absolute  border-white top-full mt-2 left-0 right-0 bg-primary shadow-lg rounded-lg transition-opacity duration-300 z-[255] ${
          taskArrowIsClicked ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {elements.map((el) => (
          <div
            key={el}
            className=" p-2 cursor-pointer "
            onClick={() => handleElementTypeChange(el)}
          >
            <span className="text-text hover:text-dominant transition transition-color">
              {el.charAt(0).toUpperCase() + el.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
