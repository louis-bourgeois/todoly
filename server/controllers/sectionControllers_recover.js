import Section from "../models/Section.js";
import User from "../models/User.js";
import { isUUID } from "../utils/validate.js";

export async function getSection(req, res) {
  try {
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    const sections = await Section.find(
      undefined,
      undefined,
      undefined,
      userId
    );
    return res.status(200).json({ sections: sections });
  } catch (error) {
    res.status(500).json(error.message)
  }
}

export async function addSection(req, res) {
  try {
    const user = req.user;

    const found_user = await User.findId(undefined, user.email, undefined);

    const userId = found_user[0][0];
    const section = req.body.section;

    const newSection = new Section(section.name, userId, section.workspace_id);
    await newSection.save();
    const user_workspaces = await User.findWorkspacesByUserId(userId);

    const user_sections = [];
    await Promise.all(
      user_workspaces.map(async (workspace) => {
        const sections = await Section.find(workspace.id);
        user_sections.push(...sections);
      })
    );

    res
      .status(200)
      .json({ message: "Section added successfully", sections: user_sections });
  } catch (error) {
    if (error.status === 400) {
      res.status(400).json(error.message);
    } else {
      res.status(500).json(error);
    }
  }
}

export async function updateSection(req, res) {
  const user = req.user;
  const found_user = await User.findId(undefined, user.email, undefined);
  const userId = found_user[0][0];

  try {
    await Section.update(req.body.newName, req.body.sectionId, userId);

    const user_sections = [];
    const user_workspaces = await User.findWorkspacesByUserId(userId);

    await Promise.all(
      user_workspaces.map(async (workspace) => {
        const sections = await Section.find(workspace.id);
        user_sections.push(...sections);
      })
    );

    res.status(200).json({
      message: "Section updated successfully",
      user_sections,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

export async function deleteSection(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;
  const found_user = await User.findId(undefined, user.email, undefined);
  const userId = found_user[0][0];
  const sectionId = req.params.id;

  try {
    if (!isUUID(sectionId)) {
      throw new Error("Invalid section id (when deleting)");
    }
    await Section.delete(sectionId, userId);
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
