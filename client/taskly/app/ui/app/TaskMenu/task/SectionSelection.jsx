import { useRef, useState } from "react";
import { useError } from "../../../../../context/ErrorContext";
import { useSection } from "../../../../../context/SectionContext";
import { useTask } from "../../../../../context/TaskContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";

export default function SectionSelection({
  linked_section_name,
  setLinked_section_name,
  setLinked_section,
  id,
  task,
  setTask,
  menuOpen,
  setMenuOpen,
}) {
  const [editingSectionId, setEditingSectionId] = useState(null);
  const { handleError } = useError();
  const { sections, addSection, modifySection, deleteSection } = useSection();
  const { currentWorkspace } = useWorkspace();
  const { modifyTask } = useTask();
  const [isEditingNewSection, setIsEditingNewSection] = useState(false);
  const [newSection, setNewSection] = useState({
    name: "",
    workspace_id: null,
  });

  const newSectionInputRef = useRef(null);

  const handleNewSectionSubmit = async () => {
    if (newSection.name.trim() !== "") {
      try {
        newSection.workspace_id = currentWorkspace;
        await addSection(newSection);
        setNewSection({ name: "", workspace_id: null });
        setIsEditingNewSection(false);
      } catch (error) {
        handleError("Failed to add section");
      }
    }
  };

  const handleNewSectionKeyPress = async (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      await handleNewSectionSubmit();
    }
  };

  const handleNewSectionBlur = async () => {
    await handleNewSectionSubmit();
  };

  const handleSelectSection = (section) => {
    setLinked_section(section.id);
    setMenuOpen(false);
    setLinked_section_name(section.name);
    if (id) {
      handleSectionChange(section.id);
    }
  };

  const handleSectionChange = (idValue) => {
    if (id) {
      const updatedTask = { ...task, linked_section: idValue };
      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    }
  };

  const handleAddSection = () => {
    setIsEditingNewSection(true);
    setTimeout(() => {
      newSectionInputRef.current?.focus();
    }, 0);
  };

  const handleSectionNameChange = async (e, sectionId) => {
    const newName = e.target.value;
    try {
      await modifySection(newName, sectionId);
    } catch (error) {
      console.error("Failed to modify section", error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await deleteSection(sectionId);
    } catch (error) {
      console.error("Failed to delete section", error);
      handleError(error);
    }
  };

  return (
    <TaskMenuSectionContainer othersStyles="rounded-full justify-between items-center h-[17.5%] relative cursor-pointer">
      <h2 className="pl-[4%] font-bold text-4xl">
        {linked_section_name || "Section"}
      </h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer ${
          menuOpen ? "rotate-180" : ""
        } transition-transform duration-500`}
        viewBox="0 0 29 29"
        width="62.5"
        height="62.5"
        onClick={(e) => setMenuOpen((prev) => !prev)}
      >
        <path
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="2.5"
          d="m20.5 11.5-6 6-6-6"
        ></path>
      </svg>
      <div
        className={`absolute top-full mt-2 left-0 right-0 bg-white shadow-lg rounded-lg transition-opacity duration-300 z-50 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="opacity-100 p-2 cursor-pointer hover:text-blue transition transition-color"
          onClick={handleAddSection}
        >
          Add Section
        </div>
        {sections
          .filter((section) => section.workspace_id === currentWorkspace)
          .map((section) => (
            <div key={section.id} className="flex items-center p-2">
              {editingSectionId === section.id ? (
                <input
                  type="text"
                  className="cursor-pointer flex-grow p-1 border-b border-gray-300 focus:outline-none"
                  value={section.name}
                  onChange={(e) => handleSectionNameChange(e, section.id)}
                  onKeyDown={(e) => {
                    if (e.code === "Enter") setEditingSectionId(null);
                  }}
                  onBlur={() => setEditingSectionId(null)}
                />
              ) : (
                <span
                  className="cursor-pointer flex-grow p-1 hover:text-blue"
                  onClick={() => {
                    handleSelectSection(section);
                    if (id) {
                      handleSectionChange(section.id);
                    }
                  }}
                >
                  {section.name}
                </span>
              )}
              {section.name !== "Other" && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer hover:text-blue ml-2 transition transition-color"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <button
                    className="ml-2 hover:text-blue"
                    onClick={() => setEditingSectionId(section.id)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        {isEditingNewSection && (
          <div className="p-2">
            <input
              ref={newSectionInputRef}
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="New section name"
              value={newSection.name}
              onChange={(e) =>
                setNewSection({
                  ...newSection,
                  name: e.target.value,
                })
              }
              onKeyDown={(e) => handleNewSectionKeyPress(e)}
              onBlur={handleNewSectionBlur}
            />
          </div>
        )}
      </div>
    </TaskMenuSectionContainer>
  );
}
