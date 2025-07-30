import { hashPassword } from "../middleware/pasword.js";
import Preference from "../models/Preference.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export async function checkUser(req, res, next) {
  const result = await User.find({
    email: req.body.email,
  });
  if (result) {
    req.body.db_hash_password = result[2];
    delete req.body.email;
    next();
  } else {
    res.status(404).json({
      message:
        "User not authenticated, try to refresh the page or report the error",
      reqBody: req.body,
      reqUser: req.user,
    });
  }
}
export async function deleteUser(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message:
          "User not authenticated, try to refresh the page or report the error",
      });
    }
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];
    await User.delete(userId);
    return res.status(204).json({
      message:
        "User has successfully been deleted from the Todoly's databases and servers",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error removing user" });
  }
}
export async function createUser(req, res) {
  try {
    if (!req.body.data) {
      return res.status(404).json({ message: "Data submitted not found" });
    }
    const result = await User.find(req.body.data, true);
    console.log("this is result", result)
    if (result === true) {
      return res.status(409).send("already exist");
    } else if (result === "username already taken") {
      return res.status(409).send(result);
    } else {
      const data = req.body.data;
      const user = new User(
        data.username,
        data.fName,
        data.lName,
        data.email,
        data.hashPassword
      );

      const { userId, workspaceId, defaultSectionId } = await user.save();

      const preferences_key = [
        "Default_Main_Page", "Home_Page_Title", "Theme", "Color_Theme",
        "Allow_Notifications", "Notifications_List", "Language", "TZ",
        "Date_Format", "Week_Starts_On", "Current_Workspace",
        "Last_Section", "Sort_By", "Show",
      ];
      
      const preferences_values = [
        "Currently", "Default", "Dark", "#000000", "true", "", "French",
        "Europe/Paris", "24h", "Monday", workspaceId, defaultSectionId,
        "Importance", "All tasks",
      ];

      for (let i = 0; i < preferences_key.length; i++) {
        const preference = new Preference(
          preferences_key[i],
          preferences_values[i],
          userId 
        );
        await preference.save();
      }
      return res.status(201).send("User created successfully");
    }
  } catch (e) {
    console.error("Error in createUser function:", e);
    return res.status(500).json({ error: "Internal server error during user creation." });
  }
}


export async function getUserData(req, res) {
  const result = await User.getData("all", req.body.id);

  if (result) {
    res.send(result);
  } else {
    res.status(404).json({
      message: "User not found",
      reqBody: req.body,
      reqUser: req.user,
    });
  }
}

export const findUserbyUsername = async (req, res) => {
  const result = await User.findId(req.body.username);

  if (result && result.length > 0) {
    res.status(200).send({ id: result[0][0] });
  } else {
    res.sendStatus(200);
  }
};

export const getWorkspacesByUserId = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message:
        "User not authenticated, try to refresh the page or report the error",
    });
  }
  const found_user = await User.findId(undefined, req.user.email, undefined);
  const userId = found_user[0][0];
  try {
    const workspaces = await User.findWorkspacesByUserId(userId);
    res.status(200).json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
export const addUserToWorkspace = async (req, res) => {
  const { workspaceId, userId } = req.params;
  try {
    await User.addUserToWorkspace(userId, workspaceId);
    res.status(201).send("User added to workspace");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
export const removeUserFromWorkspace = async (req, res) => {
  const { workspaceId, userId } = req.params;
  try {
    await User.removeUserFromWorkspace(userId, workspaceId);
    res.status(200).send("User removed from workspace");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const updateUser = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const id = found_user[0][0]; 
    try {
      console.log("update_user", req.body)
        let user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.body.newPassword) {
            const currentPasswordHash = await User.getHashPassword(id);
            const isMatch = await bcrypt.compare(req.body.currentPassword, currentPasswordHash);
            console.log("password match",isMatch)

            if (!isMatch) {
                console.log("not matched")
                return res.status(401).json({ message: "Incorrect current password" });
            }

            const newPasswordHash = await bcrypt.hash(req.body.newPassword, 10);
            console.log("There is a new password + update : ", newPasswordHash)
            await User.update(req.body.first_name, req.body.last_name, req.body.email, newPasswordHash, id);
        } else {
            await User.update(req.body.first_name, req.body.last_name, req.body.email, null, id);
        }

        user = await User.findById(id);
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};