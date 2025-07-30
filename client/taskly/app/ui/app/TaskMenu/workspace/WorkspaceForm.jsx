import { useCallback, useEffect, useState } from "react";
import { useError } from "../../../../../context/ErrorContext"; // Import useError
import { useMenu } from "../../../../../context/MenuContext";
import { useSection } from "../../../../../context/SectionContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import CollaboratorSelectContainer from "./CollaboratorSelectContainer";
import ElementPickerLibelle from "./ElementPickerLibelle";
import SectionSelectContainer from "./SectionSelectContainer";

export default function WorkspaceForm({
  id,
  setElementType,
  elementType,
  setCallback,
  callback,
  showContent,
  visibility,
  setShowContent,
}) {
  const { isTaskMenuOpen, toggleTaskMenu } = useMenu();
  const { createWorkspace, updateWorkspace, setActiveWorkspace, workspaces } =
    useWorkspace();
  const { sections } = useSection();
  const { handleError } = useError(); // Use the error hook
  const [workspaceSections, setWorkspaceSections] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const isNameValid = nameValue.trim() !== "";

  const handleElementTypeChange = (newType, from = undefined) => {
    if (from) {
      setCallback(from);
    }
    setIsTransitioning(true);
    setShowContent(false);
    setTimeout(() => {
      setElementType(newType);
      setShowContent(true);
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleWorkspaceAction = async () => {
    console.log("handleWorkspaceAction called")
    if (!isNameValid) {
      // Afficher l'erreur directement via le handleError pour la cohérence
      handleError({
        response: {
          data: {
            message: "Workspace name must be a non-empty string.",
            title: "Invalid Input"
          }
        }
      });
      return;
    }

    try { 
      const workspaceData = {
        name: nameValue.trim(),
        linked_sections: workspaceSections,
        collaborators: collaborators,
      };

      if (id) {
        console.log("Updating workspace with ID:", id);
        await updateWorkspace(id, workspaceData);
      } else {
        console.log("Creating new workspace:", workspaceData)
        await createWorkspace(workspaceData);
      }

      if (callback) {
        handleElementTypeChange(callback);
      } else {
        toggleTaskMenu();
      }
      setCallback("");
    } catch (error) {
      // C'est ici que la magie opère !
      handleError(error);
    }
  };

  const resetWorkspaceForm = useCallback(() => {
    setActiveWorkspace("");
    setWorkspaceSections([]);
    setCollaborators([]);
    setNameValue("");
  }, [setActiveWorkspace]);

  const transitionStyles = `transition-all duration-300 ease-in-out ${
    isTransitioning || !showContent ? "opacity-0" : "opacity-100"
  }`;

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetWorkspaceForm();
    }
  }, [isTaskMenuOpen, resetWorkspaceForm]);

  useEffect(() => {
    if (!id || !workspaces || !sections) return;

    const foundWorkspace = workspaces.find((workspace) => workspace.id === id);
    if (!foundWorkspace) return;

    const uniqueSectionIds = [
      ...new Set(sections.filter((s) => s.workspace_id === id)),
    ];
    setCollaborators(foundWorkspace.users || []);
    setNameValue(foundWorkspace.name);
    setWorkspaceSections(uniqueSectionIds);
  }, [id, workspaces, sections]);

  return (
    <div
      className={`w-full h-full flex flex-col overflow-clip ${transitionStyles}`}
    >
      <div className="flex justify-between items-center h-[15%] mb-4">
        <ElementPickerLibelle
          handleElementTypeChange={handleElementTypeChange}
          elementType={elementType}
        />
        <div className="flex-grow flex flex-col justify-center items-center">
          <input
            type="text"
            onChange={(e) => setNameValue(e.target.value)}
            value={nameValue}
            disabled={!visibility}
            placeholder={id ? "Edit Workspace" : "New Workspace"}
            className="w-full text-center placeholder:text-gray placeholder:font-light placeholder:text-5xl text-text text-5xl bg-transparent focus:outline-none"
          />
        </div>
      </div>
      <div className="flex flex-grow justify-between items-center gap-[2.5%] h-[80%]">
        <SectionSelectContainer
          setWorkspaceSections={setWorkspaceSections}
          workspaceSections={workspaceSections}
          id={id}
        />
        <div className="h-[95%] rounded-[20px] w-[50%] flex flex-col justify-between">
          <CollaboratorSelectContainer
            collaborators={collaborators}
            setCollaborators={setCollaborators}
          />
          <button
            onClick={handleWorkspaceAction}
            disabled={!isNameValid}
            className="addMenuElement text-text bg-main_menu_bg gradient-border h-[15%] rounded-[20px] text-2.5xl hover:scale-95 active:scale-100 transition-transform duration-100 ease-in disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}