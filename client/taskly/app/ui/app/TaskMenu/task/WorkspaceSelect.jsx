import { useEffect, useRef, useState } from "react";
import { useSection } from "../../../../../context/SectionContext";
import { useUser } from "../../../../../context/UserContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import TaskMenuButton from "../TaskMenuButton";
import TaskMenuSectionContainer from "../TaskMenuSectionContainer";

export default function WorkspaceSelect({
  handleNewWorkspaceClick,
  setTask,
  task,
  id,
  menuOpen,
  setMenuOpen,
}) {
  const { modifyTask } = useUser();
  const { sections } = useSection();
  const { currentWorkspace, setCurrentWorkspace, workspaces } = useWorkspace();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (task) {
      setSelectedWorkspace(task.workspace_id);
    } else {
      setSelectedWorkspace(currentWorkspace);
    }
  }, [task, currentWorkspace]);

  const handleWorkspaceChange = (workspaceId) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (!workspace) return;

    setSelectedWorkspace(workspaceId);
    setCurrentWorkspace(workspaceId);

    const updatedWorkspaceDefaultSection = sections.find(
      (section) => section.workspace_id === workspaceId
    )?.id;

    if (id && task) {
      const updatedTask = {
        ...task,
        workspace_id: workspaceId,
        linked_section: updatedWorkspaceDefaultSection || task.linked_section,
      };
      setTask(updatedTask);
      modifyTask(updatedTask, "post");
    }

    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <TaskMenuSectionContainer
      othersStyles="h-[80%] flex flex-col justify-between"
      moreRoundedCorners="tr"
    >
      <h2 className="text-2xl font-bold">Workspace</h2>

      <div className="flex items-center gap-[0.7vw] relative">
        <div
          className="addMenuElement cursor-pointer rounded-full flex items-center justify-between p-[1vw] w-full"
          onClick={toggleMenu}
        >
          {workspaces.find((workspace) => workspace.id === selectedWorkspace)
            ?.name || "Select Workspace"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-2 transition-transform duration-300 ${
              menuOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 29 29"
            width="32"
            height="32"
          >
            <path
              fill="none"
              stroke="#000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              strokeWidth="2.5"
              d="m20.5 11.5-6 6-6-6"
            />
          </svg>
        </div>
        <div
          ref={menuRef}
          className={`max-h-[108px] absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg z-50 w-full transition-all duration-300 ease-in-out ${
            menuOpen ? " opacity-100 visible" : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="max-h-[104px] overflow-y-auto flex flex-col">
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleWorkspaceChange(workspace.id)}
                className="hover:text-dominant transition-colors duration-300 w-full text-left py-2 px-4"
              >
                {workspace.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TaskMenuButton
        othersStyles="glass-morphism flex justify-center items-center hover:scale-105 m-1"
        onClick={() => handleNewWorkspaceClick("Workspace", "Task")}
      >
        <span className="text-l font-bold">Build a new Workspace</span>
      </TaskMenuButton>
    </TaskMenuSectionContainer>
  );
}
