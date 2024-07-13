import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

export const createWorkspace = async (req, res) => {
  const user = req.user;
  const found_user = await User.findId(undefined, user.email, undefined);
  const userId = found_user[0][0];

  const { name, linked_sections } = req.body;

  if (!userId) {
    return res.status(400).send("User ID is required to create a workspace");
  }

  try {
    const workspace = new Workspace(name);
    const workspaceId = await workspace.save(userId, linked_sections);
    const workspaces = await User.findWorkspacesByUserId(userId);
    res.status(201).send({
      workspaces,
      workspaceId,
      message: "Workspace created and user added to workspace",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const updateWorkspace = async (req, res) => {
  console.log(req.body);
  const { data } = req.body;
  const { id } = req.params;
  if (!data) {
    return res.status(400).send("Missing new data to update workspace");
  }
  if (!id) {
    return res.status(400).send("Missing workspace ID to update workspace");
  }

  try {
    const user = req.user;
    const found_user = await User.findId(undefined, user.email, undefined);
    const userId = found_user[0][0];
    await Workspace.update(id, data);

    const workspaces = await User.findWorkspacesByUserId(userId);
    let sections = [];
    await Promise.all(
      workspaces.map(async (workspace) => {
        const workspaceSections = await User.getSections(workspace.id);

        sections.push(...workspaceSections);
      })
    );
    res.status(200).send({
      message: "Workspace Successfully updated",
      workspaces: workspaces,
      sections: sections,
    });
  } catch (error) {
    console.error("Error updating workspace:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the workspace" });
  }
};

export const getWorkspace = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .send("The workspace ID is required to get the workspace data");
  }
  try {
    const workspaceData = await Workspace.findById(id);
    res.status(200).send({ workspaceData });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const deleteWorkspace = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    await Workspace.deleteById(workspaceId);
    res.status(200).send("Workspace deleted");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getTasksByWorkspaceId = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const tasks = await Workspace.findTasksByWorkspaceId(workspaceId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const getUsersByWorkspaceId = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const users = await Workspace.findUsersByWorkspaceId(workspaceId);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
