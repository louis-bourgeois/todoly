import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "../../../../../context/MenuContext";
import { useSection } from "../../../../../context/SectionContext";
import { useUser } from "../../../../../context/UserContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import WorkspaceLayoutDescription from "../MenuLayouts/Workspace/WorkspaceLayoutDescription";
import WorkspaceLayoutHeader from "../MenuLayouts/Workspace/WorkspaceLayoutHeader";
import WorkspaceLayoutSection from "../MenuLayouts/Workspace/WorkspaceLayoutSection";

const WorkspaceView = ({ id }) => {
  const textareaRef = useRef(null);
  const { sections } = useSection();
  const { user } = useUser();
  const { workspaces, updateWorkspace } = useWorkspace();
  const [workspace, setWorkspace] = useState(null);
  const [workspaceSections, setWorkspaceSections] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const { setCardType } = useMenu();

  useEffect(() => {
    if (!id || !workspaces || !sections) return;

    const foundWorkspace = workspaces.find((workspace) => workspace.id === id);
    if (!foundWorkspace) return;

    const uniqueSectionIds = [
      ...new Set(
        sections.filter((s) => {
          return s.workspace_id === id;
        })
      ),
    ];

    console.log("Found Workspace:", foundWorkspace);
    setWorkspace(foundWorkspace);
    setCollaborators(foundWorkspace.users || []);
    setWorkspaceTitle(foundWorkspace.name);
    setWorkspaceDescription(foundWorkspace.description || "");
    setWorkspaceSections(uniqueSectionIds);
  }, [id, workspaces, sections]);

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
    if (!workspace) return;

    const updatedWorkspace = {
      ...workspace,
      linked_sections: workspaceSections,
      name: workspaceTitle,
      description: workspaceDescription,
      collaborators: collaborators,
      // Note: We're not updating linked_sections here as it's derived from tasks
    };

    try {
      await updateWorkspace(id, updatedWorkspace);
      console.log("Workspace updated:", updatedWorkspace);
      setCardType("All");
      // You can add a success notification here
    } catch (error) {
      console.error("Failed to update workspace:", error);
      // You can add an error notification here
    }
  }, [
    workspace,
    id,
    workspaceTitle,
    workspaceSections,
    workspaceDescription,
    collaborators,
    updateWorkspace,
    setCardType,
  ]);

  if (!workspace) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <WorkspaceLayoutHeader
        workspaceTitle={workspaceTitle}
        setWorkspaceTitle={setWorkspaceTitle}
        handleWorkspaceClick={handleWorkspaceAction}
        update={true}
      />
      <WorkspaceLayoutDescription
        workspaceDescription={workspaceDescription}
        setWorkspaceDescription={setWorkspaceDescription}
        textareaRef={textareaRef}
      />
      <WorkspaceLayoutSection
        label={"Collaborators"}
        searchLabel={"Add collaborator by username"}
        link={"Functionnality not yet implemented, stay tuned ;)"}
        onItemSelect={handleCollaboratorAdd}
        isCollaborator={true}
      />
      {collaborators.length > 0 && (
        <div className="px-4 mt-2">
          <h3 className="text-sm font-semibold mb-3 text-text">
            Selected Collaborators:
          </h3>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((collab, index) => (
              <span
                key={index}
                className="bg-primary gradient-border text-dominant text-xs font-medium mr-2 px-3 py-2 rounded-full flex items-center"
              >
                {collab.username}
                {collab.username !== user.username && (
                  <button
                    onClick={() => handleRemoveCollaborator(index)}
                    className="ml-1 text-blue-800 hover:text-blue-900 "
                  >
                    ×
                  </button>
                )}
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
          <h3 className="text-sm font-semibold mb-3 text-text">
            Selected Sections:
          </h3>
          <div className="flex flex-wrap gap-2">
            {workspaceSections.map((section) => (
              <span
                key={section.id}
                className="bg-secondary text-text hover:text-dominant transition-colors text-xs font-medium mr-2 px-4 py-2 rounded-full gradient-border flex items-center"
              >
                {section.name}
                {workspace.name !== "Personal" && section.name !== "Other" && (
                  <button
                    onClick={() => handleRemoveSection(section.id)}
                    className="ml-1 bg-secondary text-primary hover:text-dominant transition-colors"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceView;
