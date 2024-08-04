import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../../../../../context/MenuContext";
import { useSection } from "../../../../../../context/SectionContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import WorkspaceLayoutDescription from "./WorkspaceLayoutDescription";
import WorkspaceLayoutHeader from "./WorkspaceLayoutHeader";
import WorkspaceLayoutSection from "./WorkspaceLayoutSection";
const capitalize = (str) => {
  if (typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function WorkspaceLayout() {
  const textareaRef = useRef(null);
  const { sections } = useSection();
  const { createWorkspace } = useWorkspace();
  const [workspaceSections, setWorkspaceSections] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const { setCardType } = useMenu();
  const [lastUrlSegment, setLastUrlSegment] = useState("");

  useEffect(() => {
    function updateLastUrlSegment() {
      if (typeof window !== "undefined") {
        const segments = window.location.pathname.split("/");
        const newLastSegment = segments[segments.length - 1] || "home";
        console.log("New last URL segment:", newLastSegment);
        setLastUrlSegment(newLastSegment);
      }
    }

    // Initial update
    updateLastUrlSegment();

    // Listen for changes in the URL
    window.addEventListener("popstate", updateLastUrlSegment);

    // Cleanup
    return () => window.removeEventListener("popstate", updateLastUrlSegment);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const maxHeight = window.innerHeight * 0.075;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    adjustHeight();

    return () => textarea.removeEventListener("input", adjustHeight);
  }, []);

  const filteredSections = useMemo(() => {
    return sections.filter(
      (section) =>
        section.name.toLowerCase() !== "other" &&
        !workspaceSections.some((ws) => ws.id === section.id)
    );
  }, [sections, workspaceSections]);

  const handleSectionSelect = useCallback((selectedSection) => {
    setWorkspaceSections((prev) => [...prev, selectedSection]);
  }, []);

  const handleCollaboratorAdd = useCallback((collaborator) => {
    setCollaborators((prev) => [...prev, collaborator]);
  }, []);

  const handleRemoveCollaborator = useCallback((index) => {
    setCollaborators((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleRemoveSection = useCallback((sectionId) => {
    setWorkspaceSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    );
  }, []);

  const handleWorkspaceAction = useCallback(async () => {
    const workspaceData = {
      name: workspaceTitle,
      description: workspaceDescription,
      linked_sections: workspaceSections,
      collaborators: collaborators,
    };

    try {
      await createWorkspace(workspaceData);
      console.log("Workspace created:", workspaceData);
      const newCardType = capitalize(lastUrlSegment);
      console.log("Setting new cardType:", newCardType);
      setCardType(newCardType);
      setCollaborators([]);
      setWorkspaceSections([]);
      setWorkspaceDescription("");
      setWorkspaceTitle("");

      // Reset form or navigate away after successful creation
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
  }, [
    workspaceTitle,
    workspaceDescription,
    workspaceSections,
    collaborators,
    createWorkspace,
  ]);

  return (
    <>
      <WorkspaceLayoutHeader
        workspaceTitle={workspaceTitle}
        setWorkspaceTitle={setWorkspaceTitle}
        handleWorkspaceClick={handleWorkspaceAction}
      />
      <WorkspaceLayoutDescription
        workspaceDescription={workspaceDescription}
        setWorkspaceDescription={setWorkspaceDescription}
        textareaRef={textareaRef}
      />
      <WorkspaceLayoutSection
        label={"Collaborators"}
        searchLabel={"Add collaborator by username"}
        link={"google.com"}
        onItemSelect={handleCollaboratorAdd}
        isCollaborator={true}
      />
      {collaborators.length > 0 && (
        <div className="px-4 mt-2">
          <h3 className="text-sm font-semibold mb-1">
            Selected Collaborators:
          </h3>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collab, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
              >
                {collab.name}
                <button
                  onClick={() => handleRemoveCollaborator(index)}
                  className="ml-1 text-blue-800 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
      <WorkspaceLayoutSection
        label={"Link sections"}
        searchLabel={"Search sections"}
        search={true}
        items={filteredSections}
        onItemSelect={handleSectionSelect}
      />
      {workspaceSections.length > 0 && (
        <div className="px-4 mt-2">
          <h3 className="text-sm font-semibold mb-1">Selected Sections:</h3>
          <div className="flex flex-wrap gap-2">
            {workspaceSections.map((section) => (
              <span
                key={section.id}
                className="bg-secondary text-primary  hover:text-dominant transition-colors  text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center"
              >
                {section.name}
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="ml-1 bg-secondary text-primary  hover:text-dominant transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
