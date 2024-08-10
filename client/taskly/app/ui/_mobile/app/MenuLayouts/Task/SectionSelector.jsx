import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSection } from "../../../../../../context/SectionContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import Button from "../../Cards/assets/Button";

function AddSectionPortal({ isOpen, onClose, onAdd }) {
  const inputRef = useRef(null);
  const { currentWorkspace } = useWorkspace();
  const [newSectionName, setNewSectionName] = useState("");

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newSectionName.trim()) {
      console.log(newSectionName);
      onAdd(newSectionName);
      setNewSectionName(""); // Reset input after adding
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-primary opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-primary rounded-lg p-4 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          className="w-full p-3 text-sm border rounded focus:outline-none focus:ring-2 bg-primary focus:ring-blue-500 mb-4"
          placeholder="New section name"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!newSectionName || !currentWorkspace}
            className="px-4 py-2 text-sm bg-blue-500 text-primary rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function SectionSelector({ selectedSection, onSectionSelect }) {
  const { sections, addSection } = useSection();
  const { currentWorkspace } = useWorkspace();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSection = useCallback(
    async (newSectionName) => {
      if (newSectionName.trim()) {
        try {
          await addSection({
            name: newSectionName.trim(),
            workspace_id: currentWorkspace,
          });
          setIsAdding(false);
        } catch (error) {
          console.error("Failed to add section:", error);
        }
      }
    },
    [addSection, currentWorkspace]
  );

  const sectionOptions = [
    "New section",
    ...sections
      .filter((s) => s.workspace_id === currentWorkspace)
      .map((s) => s.name),
  ];

  const handleOptionClick = useCallback(
    (option) => {
      if (option === "New section") {
        setIsAdding(true);
      } else {
        onSectionSelect(option);
      }
    },
    [onSectionSelect]
  );

  return (
    <>
      <Button
        label={selectedSection || "Other"}
        options={sectionOptions}
        onOptionClick={handleOptionClick}
      />
      <AddSectionPortal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onAdd={handleAddSection}
      />
    </>
  );
}
