import Section from "../models/Section.js";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

const isWorkspaceNameValid = (name) => {
  return typeof name === "string" && name.trim().length > 0;
};

export const createWorkspace = async (req, res) => {
  console.log("controller `create workspace` called");
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated. Please log in again.",
      });
    }

    const { name, linked_sections } = req.body;
    let userId = await User.findId(req.user.username)
    console.log("user id : ", userId)
    userId = userId[0][0]
    if (!isWorkspaceNameValid(name)) {
      return res.status(400).json({
        success: false,
        message: "Workspace name must be a non-empty string.",
      });
    }

    const existingWorkspace = await Workspace.findByNameAndUser(name.trim(), userId);
    if (existingWorkspace) {
      return res.status(409).json({
        success: false,
        message: "Workspace name already used", // Static key for ErrorContext
      });
    }

    const workspace = new Workspace(name.trim());
    const { workspaceId } = await workspace.save(userId, linked_sections || []);

    const [workspaces, sections] = await Promise.all([
      User.findWorkspacesByUserId(userId),
      Section.find(undefined, undefined, undefined, userId),
    ]);

    res.status(201).json({
      success: true,
      workspaces,
      workspaceId,
      sections,
      message: "Workspace created successfully.",
    });
  } catch (error) {
    console.error("Error in createWorkspace:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the workspace.",
      error: error.message,
    });
  }
};

export const updateWorkspace = async (req, res) => {
  const { data } = req.body;
  const { id: workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated. Please log in again.",
    });
  }

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing data to update workspace.",
    });
  }
  if (!workspaceId) {
    return res.status(400).json({ success: false, message: "Missing workspace ID." });
  }

  try {
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    const { name } = data;

    if (name !== undefined) {
      if (!isWorkspaceNameValid(name)) {
        return res.status(400).json({
          success: false,
          message: "Workspace name cannot be empty.",
        });
      }

      const existingWorkspace = await Workspace.findByNameAndUser(
        name.trim(),
        userId
      );
      if (existingWorkspace && existingWorkspace.id !== workspaceId) {
        return res.status(409).json({
          success: false,
          message: "Workspace name already used", // Static key for ErrorContext
        });
      }
      data.name = name.trim();
    }

    await Workspace.update(workspaceId, data);

    const workspaces = await User.findWorkspacesByUserId(userId);
    const sections = await Section.find(undefined, undefined, undefined, userId);

    res.status(200).json({
      success: true,
      message: "Workspace successfully updated.",
      workspaces,
      sections,
    });
  } catch (error) {
    console.error("Error in updateWorkspace:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the workspace.",
    });
  }
};

export const deleteWorkspace = async (req, res) => {
  console.log("controller `delete workspace called", req.user)
  if (!req.user) {
    
    return res.status(401).json({
      success: false,
      message: "User not authenticated. Please log in again.",
    });
  }
  
  const { workspaceId } = req.params;
  const found_user = await User.findId(undefined, req.user.email, undefined);
  const userId = found_user[0][0];

  if (!workspaceId) {
    return res.status(400).json({ success: false, message: "Missing workspace ID." });
  }

  try {
    // Bug n°3: Check the 'is_deletable' flag from the database
    const workspaceToDelete = await Workspace.findById(workspaceId);

    if (!workspaceToDelete) {
        return res.status(404).json({ success: false, message: "Workspace not found." });
    }

    if (!workspaceToDelete.is_deletable) {
        return res.status(403).json({ // 403 Forbidden
            success: false,
            message: "This workspace cannot be deleted.",
        });
    }
    
    await Workspace.deleteById(workspaceId, userId);

    const sections = await Section.find(undefined, undefined, undefined, userId);
    
    res.status(200).json({ success: true, sections, message: "Workspace deleted successfully." });
  } catch (error) {
    console.error("Error in deleteWorkspace:", error);
    res.status(500).json({ success: false, message: "An error occurred while deleting the workspace.", error: error.message });
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
