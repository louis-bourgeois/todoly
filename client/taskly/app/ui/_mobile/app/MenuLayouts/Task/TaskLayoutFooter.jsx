import { useCallback, useEffect, useMemo, useState } from "react";
import { useSection } from "../../../../../../context/SectionContext";
import { useUserPreferences } from "../../../../../../context/UserPreferencesContext";
import { useWorkspace } from "../../../../../../context/WorkspaceContext";
import Button from "../../Cards/assets/Button";
import SectionSelector from "./SectionSelector";

export default function TaskLayoutFooter({
  status,
  setStatus,
  selectedSection,
  setSelectedSection,
  setSelectedWorkspace,
}) {
  const { sections } = useSection();
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { updatePreference, preferences } = useUserPreferences();
  const [selectedSectionName, setSelectedSectionName] = useState("");
  const [localLastSection, setLocalLastSection] = useState(
    preferences.Last_Section
  );

  const findSectionById = useCallback(
    (sectionId) => {
      return sections.find(
        (s) => s.id === sectionId && s.workspace_id === currentWorkspace
      );
    },
    [sections, currentWorkspace]
  );

  useEffect(() => {
    if (!selectedSection) {
      const lastSection = findSectionById(preferences.Last_Section);
      if (lastSection) {
        setSelectedSection(lastSection.id);
      } else {
        const otherSection = sections.find(
          (s) => s.name === "Other" && s.workspace_id === currentWorkspace
        );
        if (otherSection) {
          setSelectedSection(otherSection.id);
        }
      }
    }
  }, [
    selectedSection,
    setSelectedSection,
    findSectionById,
    preferences.Last_Section,
    sections,
    currentWorkspace,
  ]);

  useEffect(() => {
    const section = findSectionById(selectedSection);
    if (section) {
      setSelectedSectionName(section.name);
      if (section.id !== localLastSection) {
        setLocalLastSection(section.id);
        updatePreference({ key: "Last_Section", value: section.id });
      }
    }
  }, [selectedSection, findSectionById, updatePreference, localLastSection]);

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

  const handleSectionSelect = useCallback(
    (sectionName) => {
      const selectedSection = sections.find(
        (s) => s.name === sectionName && s.workspace_id === currentWorkspace
      );
      if (selectedSection && selectedSection.id !== localLastSection) {
        setSelectedSection(selectedSection.id);
        setLocalLastSection(selectedSection.id);
        updatePreference({ key: "Last_Section", value: selectedSection.id });
      }
    },
    [
      sections,
      setSelectedSection,
      currentWorkspace,
      updatePreference,
      localLastSection,
    ]
  );

  const handleWorkspaceDropdownClick = useCallback(
    (option) => {
      const selectedWorkspace = workspaces.find((w) => w.name === option);
      if (selectedWorkspace) {
        setSelectedWorkspace(selectedWorkspace.id);
        setCurrentWorkspace(selectedWorkspace.id);
        const lastSection = sections.find(
          (s) =>
            s.id === localLastSection && s.workspace_id === selectedWorkspace.id
        );
        if (lastSection) {
          setSelectedSection(lastSection.id);
        } else {
          const otherSection = sections.find(
            (s) => s.name === "Other" && s.workspace_id === selectedWorkspace.id
          );
          if (otherSection) {
            setSelectedSection(otherSection.id);
            setLocalLastSection(otherSection.id);
            updatePreference({ key: "Last_Section", value: otherSection.id });
          }
        }
      }
    },
    [
      workspaces,
      setSelectedWorkspace,
      setCurrentWorkspace,
      sections,
      setSelectedSection,
      updatePreference,
      localLastSection,
    ]
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
      <SectionSelector
        selectedSection={selectedSectionName}
        onSectionSelect={handleSectionSelect}
      />
      <Button
        label={currentWorkspaceName}
        options={workspaceOptions}
        onOptionClick={handleWorkspaceDropdownClick}
      />
    </div>
  );
}
