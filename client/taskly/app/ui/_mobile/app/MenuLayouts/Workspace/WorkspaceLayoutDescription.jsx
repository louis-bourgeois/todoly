import React, { useEffect, useRef, useState } from "react";

const WorkspaceLayoutDescription = ({
  workspaceDescription,
  setWorkspaceDescription,
}) => {
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
      value={workspaceDescription}
      onChange={(e) => setWorkspaceDescription(e.target.value)}
      className="w-full px-4 bg-primary font-light text-xs min-h-[2.5vh] max-h-[7.5vh] transition-height duration-200 ease-in-out placeholder:text-grey focus:outline-none resize-none"
      placeholder="Your wonderful description"
    />
  );
};

export default React.memo(WorkspaceLayoutDescription);
