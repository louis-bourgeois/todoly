import Task from "../models/Task.js";
import User from "../models/User.js";
import { isUUID } from "../utils/validate.js";

export async function getTask(req, res) {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({
          message:
            "User not authenticated, try to refresh the page or report the error",
        });
      return;
    }
    const found_user = await User.findId(undefined, req.user.email, undefined);
    const userId = found_user[0][0];

    const tasks = await Task.find(false, false, userId);
    return res.status(200).json({ tasks: tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting task" });
  }
}

export async function updateTask(req, res) {
  try {
    const { task } = req.body;
    await Task.update(task);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating task" });
  }
}

export async function addTask(req, res) {
  if (!req.user) {
    res
      .status(401)
      .json({
        message:
          "User not authenticated, try to refresh the page or report the error",
      });
    return;
  }
  try {
    const { formattedTaskData: newTaskData } = req.body;
    const user = req.user;
    const found_user = await User.findId(undefined, user.email, undefined);
    const linked_section = newTaskData.linked_section || "";
    const user_id = found_user[0][0];
    const priority = newTaskData.priority || undefined;
    const task = new Task(
      user_id,
      newTaskData.title,
      newTaskData.status,
      linked_section,
      priority,
      newTaskData.dueDate,
      newTaskData.tags,
      newTaskData.description,
      newTaskData.workspaceId
    );

    const newTaskId = await task.save();

    let savedTask = await Task.find(undefined, newTaskId);

    const updated_user_workspaces = await User.findWorkspacesByUserId(user_id);
    const user_tasks = [];
    await Promise.all(
      updated_user_workspaces.map(async (workspace) => {
        const tasks = await Task.find(workspace.id);
        user_tasks.push(
          ...tasks.map((task) => ({
            ...task,
          }))
        );
      })
    );
    res.status(201).json({
      message: "Task added successfully",
      savedTask: savedTask,
      workspaces: updated_user_workspaces,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("A task with the title")) {
      res.status(409).json("Title already used");
    } else if (error.message.includes("title is too long")) {
      res.status(409).json("The new task's title is too long");
    } else {
      res.status(500).json(error.message);
    }
  }
}

export async function deleteTask(req, res) {
  const uuid = req.params.id;

  const uuid_isOK = isUUID(uuid);

  if (uuid_isOK) {
    await Task.delete(uuid);
  }

  res.sendStatus(200);
}

export const checkTaskInWorkspace = async (req, res) => {
  const { taskId, workspaceId } = req.params;
  try {
    const isInWorkspace = await Task.isTaskInWorkspace(taskId, workspaceId);
    res.status(200).json({ isInWorkspace });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const addTaskToWorkspace = async (req, res) => {
  const { workspaceId, taskId } = req.params;
  try {
    await Task.addTaskToWorkspace(taskId, workspaceId);
    res.status(201).send("Task added to workspace");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

export const removeTaskFromWorkspace = async (req, res) => {
  const { workspaceId, taskId } = req.params;
  try {
    await Task.removeTaskFromWorkspace(taskId, workspaceId);
    res.status(200).send("Task removed from workspace");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
