import { useState } from "react";
import { useUser } from "../../../../context/UserContext";
import { useWorkspace } from "../../../../context/WorkspaceContext";
import TaskMenuButton from "./TaskMenuButton";
import TaskMenuSectionContainer from "./TaskMenuSectionContainer";

export default function WorkspaceSelect() {
  const { workspaces } = useUser();
  const { currentWorkspace, setCurrentWorkspace} = useWorkspace();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleCurrentWorkspaceClick = (name) => {
    const workspace = workspaces.find((workspace) => workspace.name === name);
    if (workspace) setCurrentWorkspace(workspace.id);
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
          {workspaces.find((workspace) => workspace.id === currentWorkspace)
            ?.name || ""}
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
        <div
          className={`absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg transition-opacity duration-300 z-50 w-full ${
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-2 text-center text-black flex flex-col items-start">
            {workspaces.map((workspace, index) => (
              <button
                key={index}
                onClick={() => handleCurrentWorkspaceClick(workspace.name)}
                className="hover:text-blue transition-colors duration-300"
              >
                {workspace.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TaskMenuButton othersStyles="glass-morphism flex justify-center items-center hover:scale-105 m-1">
        <span className="text-xl font-bold">Build a new Workspace</span>
      </TaskMenuButton>
    </TaskMenuSectionContainer>
  );
}
