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
      const selectedSection = sections.find((s) => s.name === option);
      if (selectedSection) {
        setSelectedSection(selectedSection.id);
      }
    },
    [sections, setSelectedSection]
  );

  const handleWorkspaceDropdownClick = useCallback(
    (option) => {
      const selectedWorkspace = workspaces.find((w) => w.name === option);
      if (selectedWorkspace) {
        setSelectedWorkspace(selectedWorkspace.id);
        setCurrentWorkspace(selectedWorkspace.id);
      }
    },
    [workspaces, setSelectedWorkspace]
  );

  const sectionOptions = useMemo(
    () =>
      sections
        .filter((s) => s.name !== "Other" && s.id !== selectedSection)
        .map((s) => s.name),
    [sections, selectedSection]
  );

  const workspaceOptions = useMemo(
    () => workspaces.map((w) => w.name),
    [workspaces]
  );

  return (
    <div className="px-4 w-full flex justify-center items-center gap-[0.65vw]">
      <Button
        label={status}
        options={["To Do", "Done", "In Progress"]}
        onOptionClick={handleStatusDropdownClick}
      />
      <Button
        label={selectedSectionName || "Select Section"}
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
