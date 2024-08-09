import Preference from "../models/Preference.js";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

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
      message: "User not found",
      reqBody: req.body,
      reqUser: req.user,
    });
  }
}
export async function createUser(req, res) {
  try {
    const result = await User.find(req.body.data, true);

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
      const saveData = await user.save();
      const workspace = new Workspace(
        "Personal",
        "Your default workspace for personal tasks"
      );
      const { workspaceId, defaultSection } = await workspace.save(saveData[0]);


      const preferences_key = [
        "Default_Main_Page",
        "Home_Page_Title",
        "Theme",
        "Color_Theme",
        "Allow_Notifications",
        "Notifications_List",
        "Language",
        "TZ",
        "Date_Format",
        "Week_Starts_On",
        "Current_Workspace",
        "Last_Section",
        "Sort_By",
        "Show",
      ];
      const preferences_values = [
        "Currently",
        "Depending on the time of day + name",
        "Light",
        "#007aff",
        "true",
        "",
        "French",
        "Europe/Paris",
        "24h",
        "Monday",
        workspaceId,
        defaultSection,
        "Importance",
        "All tasks",
      ];
      for (let i = 0; i < preferences_key.length; i++) {
        const preference = new Preference(
          preferences_key[i],
          preferences_values[i],
          saveData[0]
        );
        await preference.save();
      }
      return res.status(201).send("User created successfully");
    }
  } catch (e) {
    console.error("Error in createUser function:", e);
    console.error("Error stack:", e.stack);
    return res.status(500).json(e);
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

  if (result.length > 0) {
    res.status(200).send({ id: result[0][0] });
  } else res.sendStatus(200);
};

export const getWorkspacesByUserId = async (req, res) => {
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
