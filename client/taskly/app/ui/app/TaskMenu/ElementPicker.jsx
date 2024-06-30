"use client";
import { useState } from "react";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";

export default function ElementPicker({}) {
  const [taskArrowIsClicked, setTaskArrowIsClicked] = useState(false);
  return (
    <TaskMenuSectionContainer othersStyles="rounded-full justify-between items-center h-[12%]">
      <h2 className="pl-[4%] font-bold text-4xl">Task</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer ${
          taskArrowIsClicked ? "arrow-rotated" : ""
        } transition-transform duration-500`}
        viewBox="0 0 29 29"
        width="62.5"
        height="62.5"
        onClick={(e) => setTaskArrowIsClicked((prev) => !prev)}
      >
        <path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="m20.5 11.5-6 6-6-6s"
        ></path>
      </svg>
    </TaskMenuSectionContainer>
  );
}
