"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../../context/UserContext";

export default function TitleInput({
  id,
  visibility,
  titleValue,
  setTitleValue,
  setCanSubmit,
  task,
  setTask,
}) {


  const { modifyTask } = useUser();
  const taskTitleRef = useRef(null);

  const handleTitleInputChange = (e) => {
    const newValue = e.target.value;
    setTitleValue(newValue);
    if (id) {
      const updatedTask = { ...task, title: newValue };
      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    } else {
      setCanSubmit(!!newValue.length);
    }
  };

  useEffect(() => {
    if (visibility && taskTitleRef.current) {
      taskTitleRef.current.focus();
    }
  }, [visibility]);

  const getTextSizeClass = (text) => {
    const textSizeClasses = [
      { length: 4, class: "text-7xl" },
      { length: 5, class: "text-6xl" },
      { length: 6, class: "text-5xl" },
      { length: 8, class: "text-4xl" },
      { length: 10, class: "text-3xl" },
      { length: 12, class: "text-2xl" },
      { length: 13, class: "text-xl" },
    ];

    for (const { length, class: textClass } of textSizeClasses) {
      if (text.length < length) {
        return textClass;
      }
    }
    return "text-xl";
  };

  return (
    <div className="h-[25%] flex justify-center items-center">
      <input
        ref={taskTitleRef}
        type="text"
        disabled={!visibility}
        placeholder={id ? titleValue : "Title"}
        value={titleValue}
        onChange={(e) => handleTitleInputChange(e)}
        className={`${
          !visibility && "cursor-default"
        } bg-transparent text-center w-full p-8 focus:outline-none text-blue font-bold placeholder-blue ${getTextSizeClass(
          titleValue
        )}`}
      />
    </div>
  );
}
