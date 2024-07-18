import Tag from "../models/Tag.js";
import User from "../models/User.js";

export async function getTag(req, res) {
  try {
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    const tags = await Tag.find(userId);
    return res.status(200).json({ tags: tags });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating tag" });
  }
}

export async function addTag(req, res) {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({
        title: "Invalid tag name",
        subtitle: "Tag name cannot be empty.",
      });
    }

    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];

    // Check if tag already exists for this user
    const existingTag = await Tag.find(userId, name.trim());
    if (existingTag.length > 0) {
      return res.status(400).json({
        title: "Duplicate tag",
        subtitle: "This tag already exists for the user.",
      });
    }

    const tag = new Tag(name.trim(), userId);
    await tag.save();
    const user_tags = await Tag.find(userId);
    res
      .status(200)
      .json({ message: "Tag added successfully", tags: user_tags });
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({
      title: "Server error",
      subtitle: "Failed to add tag. Please try again.",
    });
  }
}

export async function updateTag(req, res) {
  try {
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    const { newName, id } = req.body;
    console.log("====================================");
    console.log("new namd", newName, req.body);
    console.log("====================================");
    if (!newName || newName.trim() === "") {
      return res.status(400).json({
        title: "Invalid tag name",
        subtitle: "Tag name cannot be empty.",
      });
    }

    // Check if new tag name already exists for this user
    const existingTag = await Tag.find(userId, newName.trim());
    if (existingTag.length > 0 && existingTag[0].id !== id) {
      return res.status(400).json({
        title: "Duplicate tag",
        subtitle: "This tag name already exists.",
      });
    }

    await Tag.update(newName.trim(), id);
    const user_tags = await Tag.find(userId);
    res.status(200).json({
      message: "Tag updated successfully",
      tags: user_tags,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      title: "Failed to update tag",
      subtitle: "An error occurred while updating the tag.",
    });
  }
}

export async function deleteTag(req, res) {
  try {
    const { id } = req.params;
    await Tag.delete(id);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ title: "Failed to delete tag", subtitle: error.message });
  }
}
