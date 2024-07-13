import { useEffect, useState } from "react";
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
  const { workspaces, sections, modifyTask } = useUser();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

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

  return (
    <TaskMenuSectionContainer
      othersStyles="h-[80%] flex flex-col justify-between"
      moreRoundedCorners="tr"
    >
      <h2 className="text-3xl font-bold">Workspace</h2>

      <div className="flex items-center gap-[0.7vw] relative">
        <div
          className="addMenuElement cursor-pointer rounded-full flex items-center justify-between p-[1vw] w-full"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {workspaces.find((workspace) => workspace.id === selectedWorkspace)
            ?.name || "Select Workspace"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`ml-2 transition-transform duration-500 ${
              menuOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 29 29"
            width="24"
            height="24"
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
        {menuOpen && (
          <div className="absolute top-full overflow-y-auto max-h-[10vh] mt-2 left-0 bg-white shadow-lg rounded-lg z-50 w-full">
            <div className="p-2 text-center text-black flex flex-col items-start">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceChange(workspace.id)}
                  className="hover:text-blue transition-colors duration-300 w-full text-left py-1"
                >
                  {workspace.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <TaskMenuButton
        othersStyles="glass-morphism flex justify-center items-center hover:scale-105 m-1"
        onClick={() => handleNewWorkspaceClick("Workspace", "Task")}
      >
        <span className="text-xl font-bold">Build a new Workspace</span>
      </TaskMenuButton>
    </TaskMenuSectionContainer>
  );
}
