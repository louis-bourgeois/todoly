import { useCallback, useEffect, useMemo, useState } from "react";
import { useSection } from "../../../../../../context/SectionContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import Button from "../../Cards/assets/Button";

export default function TaskLayoutFooter({
  status,
  setStatus,
  selectedSection,
  setSelectedSection,
  setSelectedWorkspace,
}) {
  const { sections } = useSection();
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();

  const [selectedSectionName, setSelectedSectionName] = useState("");

  // Fonction pour trouver la section "Other" dans le workspace actuel
  const findOtherSection = useCallback(() => {
    return sections.find(
      (s) => s.name === "Other" && s.workspace_id === currentWorkspace
    );
  }, [sections, currentWorkspace]);

  // Effet pour initialiser la section sélectionnée
  useEffect(() => {
    if (!selectedSection) {
      const otherSection = findOtherSection();
      if (otherSection) {
        setSelectedSection(otherSection.id);
      }
    }
  }, [selectedSection, setSelectedSection, findOtherSection]);

  // Effet pour mettre à jour le nom de la section sélectionnée
  useEffect(() => {
    const section = sections.find((s) => s.id === selectedSection);
    setSelectedSectionName(section ? section.name : "");
  }, [selectedSection, sections]);

  const currentWorkspaceName = useMemo(
    () =>
      workspaces.find((w) => w.id === currentWorkspace)?.name ||
      "Select Workspace",
    [workspaces, currentWorkspace]
  );

  const handleStatusDropdownClick = useCallback(
    (option) => {
      setStatus(option);
    },
    [setStatus]
  );

  const handleSectionDropdownClick = useCallback(
    (option) => {
      const selectedSection = sections.find(
        (s) => s.name === option && s.workspace_id === currentWorkspace
      );
      if (selectedSection) {
        setSelectedSection(selectedSection.id);
      }
    },
    [sections, setSelectedSection, currentWorkspace]
  );

  const handleWorkspaceDropdownClick = useCallback(
    (option) => {
      const selectedWorkspace = workspaces.find((w) => w.name === option);
      if (selectedWorkspace) {
        setSelectedWorkspace(selectedWorkspace.id);
        setCurrentWorkspace(selectedWorkspace.id);
        // Réinitialiser la section sélectionnée à "Other" dans le nouveau workspace
        const otherSection = sections.find(
          (s) => s.name === "Other" && s.workspace_id === selectedWorkspace.id
        );
        if (otherSection) {
          setSelectedSection(otherSection.id);
        }
      }
    },
    [
      workspaces,
      setSelectedWorkspace,
      setCurrentWorkspace,
      sections,
      setSelectedSection,
    ]
  );

  const sectionOptions = useMemo(
    () =>
      sections
        .filter(
          (s) => s.workspace_id === currentWorkspace && s.id !== selectedSection
        )
        .map((s) => s.name),
    [sections, selectedSection, currentWorkspace]
  );

  const workspaceOptions = useMemo(
    () => workspaces.map((w) => w.name),
    [workspaces]
  );

  return (
    <div className="px-4 w-full flex justify-center items-center gap-[0.65vw]">
      <Button
        label={status}
        options={["To Do", "Done"]}
        onOptionClick={handleStatusDropdownClick}
      />
      <Button
        label={selectedSectionName || "Other"}
        options={sectionOptions}
        onOptionClick={handleSectionDropdownClick}
      />
      <Button
        label={currentWorkspaceName}
        options={workspaceOptions}
        onOptionClick={handleWorkspaceDropdownClick}
      />
    </div>
  );
}
