import Section from "../models/Section.js";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

export const createWorkspace = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated, try to refresh the page or report the error",
      });
    }

    const { name, linked_sections } = req.body;
    if (!name || !linked_sections) {
      return res.status(400).json({
        success: false,
        message:
          "Some required data (name of the workspace/linked sections) hasn't been provided to the server",
      });
    }

    const found_user = await User.findId(undefined, req.user.email, undefined);
    if (!found_user || !found_user[0] || !found_user[0][0]) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userId = found_user[0][0];

    const workspace = new Workspace(name);
    const workspaceId = await workspace.save(userId, linked_sections);

    const [workspaces, sections] = await Promise.all([
      User.findWorkspacesByUserId(userId),
      Section.find(undefined, undefined, undefined, userId),
    ]);

    res.status(201).json({
      success: true,
      workspaces,
      workspaceId,
      sections,
      message: "Workspace created and user added to workspace",
    });
  } catch (error) {
    console.error("Error in createWorkspace:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the workspace",
      error: error.message,
    });
  }
};

export const updateWorkspace = async (req, res) => {
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
    console.error(error);
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
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const deleteWorkspace = async (req, res) => {
  if (!req.user) {
    res.status(401).json({
      message:
        "User not authenticated, try to refresh the page or report the error",
    });
    return;
  }
  const user = req.user;
  const found_user = await User.findId(undefined, user.email, undefined);
  const userId = found_user[0][0];
  const { workspaceId } = req.params;
  try {
    await Workspace.deleteById(workspaceId, userId);
    const sections = await Section.find(
      undefined,
      undefined,
      undefined,
      userId
    );
    res.status(200).send({ sections, message: "Workspace deleted" });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const getTasksByWorkspaceId = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const tasks = await Workspace.findTasksByWorkspaceId(workspaceId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const getUsersByWorkspaceId = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const users = await Workspace.findUsersByWorkspaceId(workspaceId);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
