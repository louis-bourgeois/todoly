import Section from "../models/Section.js";
import User from "../models/User.js";
import { isUUID } from "../utils/validate.js";

export async function addSection(req, res) {
  try {
    const user = req.body.user;

    const found_user = await User.findId(undefined, user.email, undefined);

    const userId = found_user[0][0];
    const section = req.body.section;

    const newSection = new Section(section.name, userId, section.workspace_id);
    await newSection.save();
    const user_sections = await Section.find(userId);
    res
      .status(200)
      .json({ message: "Section added successfully", sections: user_sections });
  } catch (error) {
    console.error(error);
    if (error.status === 400) {
      res.status(400).json({
        title: "This section already exists",
        subtitle: error.message,
      });
    } else {
      res.status(500).json({ title: "Failed to add section", subtitle: error });
    }
  }
}

export async function updateSection(req, res) {
  const user = req.user;
  const found_user = await User.findId(undefined, user.email, undefined);
  const userId = found_user[0][0];

  try {
    await Section.update(req.body.newName, req.body.sectionId, userId);
    const user_sections = await Section.find(userId);
    res.status(200).json({
      message: "Section updated successfully",
      user_sections,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ title: "Failed to update section", subtitle: error });
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
    if (error.message.includes("There are still tasks in it")) {
      return res.status(409).json({
        title: "You cannot delete this section",
        subtitle: error.message,
      });
    }
    return res
      .status(500)
      .json({ title: "Failed to delete section", subtitle: error.message });
  }
}
