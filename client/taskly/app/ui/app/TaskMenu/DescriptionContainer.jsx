import { useRef, useState } from "react";
import { useTask } from "../../../../context/TaskContext";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";
import { useTranslation } from "../../../i18n/client";

export default function DescriptionContainer({
  id,
  descriptionValue,
  setDescriptionValue,
  task,
  setTask,
  onFocusChange,
}) {
  const { modifyTask } = useTask();
  const { t } = useTranslation();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const descriptionRef = useRef(null);

  const updateDescription = async (value) => {
    setDescriptionValue(value);
    if (id && task) {
      const updatedTask = { ...task, description: value };

      setTask(updatedTask);
      try {
        await modifyTask(updatedTask, "post");
      } catch (error) {
        console.error("Failed to update description", error);
      }
    }
  };
  const handleDescriptionChange = async (e) => {
    const value = e.target.value;
    updateDescription(value);
  };

  const toggleFormatting = (type) => {
    const textarea = descriptionRef.current;
    const activating = type === "bold" ? !isBold : !isItalic;
    if (type === "bold") {
      setIsBold(activating);
    } else if (type === "italic") {
      setIsItalic(activating);
    }
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      applyFormatting(type);
    }
  };

  const applyFormatting = (type) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;
    const marker = type === "bold" ? "**" : "_";
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = descriptionValue.substring(
      selectionStart,
      selectionEnd
    );
    const insertion =
      selectionStart !== selectionEnd
        ? `${marker}${selectedText}${marker}`
        : `${marker}${marker}`;
    const newValue =
      descriptionValue.slice(0, selectionStart) +
      insertion +
      descriptionValue.slice(selectionEnd);
    updateDescription(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const offset = marker.length;
      textarea.selectionStart = selectionStart + offset;
      textarea.selectionEnd =
        selectionStart !== selectionEnd
          ? selectionEnd + offset
          : selectionStart + offset;
    });
  };

  return (
    <TaskMenuSectionContainer
      flex={false}
      othersStyles="font-bold text-2xl text-text w-[55%]"
    >
      <div className="flex items-center justify-between pb-0 p-[2%] select-none">
        <h2>{t('descriptionContainer.title')}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFormatting("bold")}
            className={`p-1 rounded-md border border-secondary transition ${
              isBold ? "bg-dominant text-primary" : "text-text"
            }`}
            aria-label={t('descriptionContainer.bold')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M7 5a1 1 0 0 1 1-1h4.5a4.5 4.5 0 0 1 2.52 8.24A4.75 4.75 0 0 1 15.5 20H8a1 1 0 0 1-1-1V5Zm2 9v3h6.5a2.75 2.75 0 1 0 0-5.5H9Zm0-2h4.5a2.5 2.5 0 1 0 0-5H9v5Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => toggleFormatting("italic")}
            className={`p-1 rounded-md border border-secondary transition ${
              isItalic ? "bg-dominant text-primary" : "text-text"
            }`}
            aria-label={t('descriptionContainer.italic')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10 4a1 1 0 1 1 0-2h9a1 1 0 1 1 0 2h-3.69l-4.56 16H14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2h3.69l4.56-16H10Z" />
            </svg>
          </button>
        </div>
      </div>
      <textarea
        ref={descriptionRef}
        style={{ resize: "none", outline: "none" }}
        name="description"
        value={descriptionValue}
        onChange={(e) => handleDescriptionChange(e)}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        className={`h-[80%] p-[2.5%] w-full text-base text-text pt-[4%] bg-transparent ${
          isBold ? "font-bold" : "font-normal"
        } ${isItalic ? "italic" : ""}`}
        placeholder={t('descriptionContainer.placeholder')}
      ></textarea>
    </TaskMenuSectionContainer>
  );
}
