import { useRef, useState, useEffect } from "react";
import { useError } from "../../../../../context/ErrorContext";
import { useSection } from "../../../../../context/SectionContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";
import { useTranslation } from "../../../../i18n/client";

export default function SectionSelection({
  linked_section_name,
  handleSectionChange,
  menuOpen,
  setMenuOpen,
}) {
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const { handleError } = useError();
  const { sections, addSection, modifySection, deleteSection } = useSection();
  const { currentWorkspace } = useWorkspace();
  const [isEditingNewSection, setIsEditingNewSection] = useState(false);
  const [newSection, setNewSection] = useState({
    name: "",
    workspace_id: null,
  });
  const { t } = useTranslation();

  const newSectionInputRef = useRef(null);

  const handleNewSectionSubmit = async () => {
    if (newSection.name.trim() !== "") {
      try {
        newSection.workspace_id = currentWorkspace;
        await addSection(newSection);
        setNewSection({ name: "", workspace_id: null });
        setIsEditingNewSection(false);
      } catch (error) {
        handleError(t('sectionSelection.error.add'));
      }
    } else {
        setIsEditingNewSection(false);
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
    handleSectionChange(section.id, section.name);
    setMenuOpen(false);
  };

  const handleAddSection = () => {
    setIsEditingNewSection(true);
    setTimeout(() => {
      newSectionInputRef.current?.focus();
    }, 0);
  };

  const handleStartEditing = (section) => {
    setEditingSectionId(section.id);
    setEditingName(section.name);
  };

  const handleFinishEditing = async () => {
    if (editingName.trim() === "") {

      setEditingSectionId(null);
      return;
    }

    try {
      await modifySection(editingName, editingSectionId);
    } catch (error) {
      console.error("Failed to modify section", error);
      handleError(t('sectionSelection.error.modify'));
    } finally {
      setEditingSectionId(null);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.code === "Enter") {
      handleFinishEditing();
    }
    if (e.code === "Escape") {
      setEditingSectionId(null);
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

  const filteredSections = sections.filter(
    (section) => section.workspace_id === currentWorkspace
  );

  return (
    <TaskMenuSectionContainer
      allowOverflow
      othersStyles="rounded-full justify-between items-center h-[17.5%] relative cursor-pointer overflow-visible z-[1600]"
      onClick={() => setMenuOpen((prev) => !prev)}
    >
      <h2 className="pl-[4%] font-bold text-xl select-none text-text">
        {linked_section_name || t('sectionSelect.placeholder')}
      </h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        className={`cursor-pointer ${
          menuOpen ? "rotate-180" : ""
        } transition-transform duration-500 text-text`}
        viewBox="0 0 29 29"
        width="62.5"
        height="62.5"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
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
        className={`absolute top-full mt-2 left-0 right-0 bg-primary shadow-lg rounded-lg transition-opacity duration-300 z-[1700] ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } `}
      >
        <div
          className="opacity-100 rounded-xl m-1 p-4 cursor-pointer font-bold hover:text-dominant transition-color transition-transform hover:scale-95 text-text gradient-border"
          onClick={(e) => {
            e.stopPropagation();
            handleAddSection();
          }}
        >
          {t('sectionSelection.addSection')}
        </div>
        <div
          className={`${
            filteredSections.length > 4 ? "max-h-60 overflow-y-auto" : ""
          }`}
        >
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className="flex items-center p-4 hover:bg-secondary/20"
              onClick={(e) => {
                e.stopPropagation();
                if (!editingSectionId) {
                    handleSelectSection(section);
                }
              }}
            >
              {editingSectionId === section.id ? (
                <input
                  type="text"
                  autoFocus
                  className="text-text cursor-pointer rounded-full px-4 flex-grow py-1 border border-secondary bg-primary focus:outline-none"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={handleFinishEditing} 
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="cursor-pointer select-none flex-grow py-1 hover:text-dominant text-text">
                  {section.name}
                </span>
              )}
              {section.name !== t('sectionSelection.other') && editingSectionId !== section.id && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer hover:text-dominant ml-2 transition transition-color text-text"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
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
                    className="ml-2 hover:text-dominant select-none text-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditing(section);
                    }}
                  >
                    {t('sectionSelection.edit')}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        {isEditingNewSection && (
          <div className="p-2">
            <input
              ref={newSectionInputRef}
              type="text"
              className="text-text cursor-pointer rounded-full px-4 w-full py-2 border border-secondary bg-primary focus:outline-none"
              placeholder={t('sectionSelection.newSectionPlaceholder')}
              value={newSection.name}
              onChange={(e) =>
                setNewSection({
                  ...newSection,
                  name: e.target.value,
                })
              }
              onKeyDown={(e) => handleNewSectionKeyPress(e)}
              onBlur={handleNewSectionBlur}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </TaskMenuSectionContainer>
  );
}
