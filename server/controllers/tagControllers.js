import Tag from "../models/Tag.js";
import User from "../models/User.js";

async function getAuthenticatedUserId(req, res) {
  if (!req.user) {
    res.status(401).json({
      message:
        "User not authenticated, try to refresh the page or report the error",
    });
    return null;
  }

  const foundUser = await User.findId(undefined, req.user.email, undefined);
  return foundUser[0][0];
}

export async function getTag(req, res) {
  try {
    const userId = await getAuthenticatedUserId(req, res);
    if (!userId) {
      return;
    }
    const tags = await Tag.find(userId);
    return res.status(200).json({ tags: tags });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating tag" });
  }
}

export async function addTag(req, res) {
  try {
    const userId = await getAuthenticatedUserId(req, res);
    if (!userId) {
      return;
    }
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json("Tag name cannot be empty.");
    }

    const existingTag = await Tag.find(userId, name.trim());
    if (existingTag.length > 0) {
      return res.status(400).json("Duplicate tag");
    }

    const tag = new Tag(name.trim(), userId);
    await tag.save();
    const user_tags = await Tag.find(userId);
    res
      .status(200)
      .json({ message: "Tag added successfully", tags: user_tags });
  } catch (error) {
    console.error(error);
    res.status(500).json("Failed to add tag. Please try again.");
  }
}

export async function updateTag(req, res) {
  try {
    const userId = await getAuthenticatedUserId(req, res);
    if (!userId) {
      return;
    }
    const { newName, id } = req.body;
    if (!newName || newName.trim() === "") {
      return res.status(400).json("Tag name cannot be empty.");
    }

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
    res.status(500).json("An error occurred while updating the tag");
  }
}

export async function deleteTag(req, res) {
  try {
    if (!(await getAuthenticatedUserId(req, res))) {
      return;
    }
    const { id } = req.params;
    await Tag.delete(id);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}
