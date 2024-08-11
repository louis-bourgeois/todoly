import React from "react";
import Button from "../../Cards/assets/Button";

const WorkspaceLayoutHeader = ({
  workspaceTitle,
  setWorkspaceTitle,
  handleWorkspaceClick,
  update = false,
}) => (
  <div className="flex w-full justify-between items-center pt-2 px-4">
    <input
      type="text"
      value={workspaceTitle}
      onChange={(e) => setWorkspaceTitle(e.target.value)}
      placeholder="A workspace."
      className="text-text w-full text-2xl font-bold placeholder:text-2xl placeholder:text-grey focus:outline-none bg-primary"
    />
    <Button
      label={update ? "Update" : "Create"}
      dominant={true}
      onClick={handleWorkspaceClick}
    />
  </div>
);

export default React.memo(WorkspaceLayoutHeader);
