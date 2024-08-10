import React, { useEffect, useRef, useState } from "react";

const TaskLayoutDescription = ({ taskDescription, setTaskDescription }) => {
  const textareaRef = useRef(null);
  const [isAtMaxHeight, setIsAtMaxHeight] = useState(false);
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const maxHeight = window.innerHeight * 0.075;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      setIsAtMaxHeight(newHeight === maxHeight);
    };

    textarea.addEventListener("input", adjustHeight);
    adjustHeight();

    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={taskDescription}
      onChange={(e) => setTaskDescription(e.target.value)}
      className="w-full text-text bg-primary  px-4 font-light text-xs min-h-[2.5vh] max-h-[7.5vh] transition-height duration-200 ease-in-out placeholder:text-grey focus:outline-none resize-none"
      placeholder="Your wonderful description"
    />
  );
};

export default React.memo(TaskLayoutDescription);
