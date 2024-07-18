import { useEffect, useRef, useState } from "react";

const EditableTag = ({ tag, onUpdate, onRemove }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(tag.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (editedName.trim() !== "" && editedName !== tag.name) {
      onUpdate(tag.id, editedName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type="text"
      value={editedName}
      onChange={(e) => setEditedName(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="bg-ternary text-dominant text-xs font-semibold py-1 px-2 rounded-full focus:outline-none"
    />
  ) : (
    <span
      className="bg-ternary text-dominant text-xs font-semibold py-1 px-2 rounded-full flex items-center cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      {tag.name}
      <button
        onClick={() => onRemove(tag.id)}
        className="ml-2 text-grey hover:text-important"
      >
        ×
      </button>
    </span>
  );
};
export default EditableTag;
