import { io } from "../index.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { isUUID } from "../utils/validate.js";

export async function updateTask(req, res) {
  console.log("task data received", req.body);
  try {
    const { task } = req.body;

    await Task.update(task);
    io.emit("taskUpdated", task);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Error updating task" });
  }
}

export async function addTask(req, res) {
  try {
    const { taskData: newTaskData } = req.body;
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

    // Récupérez la tâche complète après l'enregistrement
    const savedTask = await Task.find(undefined, newTaskId);

    const updated_user_workspaces = await User.findWorkspacesByUserId(user_id);
    const user_tasks = [];
    await Promise.all(
      updated_user_workspaces.map(async (workspace) => {
        const tasks = await Task.find(workspace.id);
        user_tasks.push(...tasks);
      })
    );

    io.emit("taskAdded", savedTask);

    res.status(201).json({
      message: "Task added successfully",
      tasks: user_tasks,
      workspaces: updated_user_workspaces,
    });
  } catch (error) {
    console.error("Error adding task:", error);

    if (error.message.includes("A task with the title")) {
      res
        .status(409)
        .json({ title: "Title already used", subtitle: error.message });
    } else if (error.message.includes("title is too long")) {
      res.status(409).json({
        title: "The new task's title is too long",
        subtitle: error.message,
      });
    } else {
      res
        .status(500)
        .json({ title: "Internal Server Error", subtitle: error.message });
    }
  }
}

export async function deleteTask(req, res) {
  const uuid = req.params.id;

  const uuid_isOK = isUUID(uuid);

  if (uuid_isOK) {
    await Task.delete(uuid);
    io.emit("taskDeleted", uuid);
  }

  res.sendStatus(200);
}

export const checkTaskInWorkspace = async (req, res) => {
  const { taskId, workspaceId } = req.params;
  try {
    const isInWorkspace = await Task.isTaskInWorkspace(taskId, workspaceId);
    res.status(200).json({ isInWorkspace });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const addTaskToWorkspace = async (req, res) => {
  const { workspaceId, taskId } = req.params;
  try {
    await Task.addTaskToWorkspace(taskId, workspaceId);
    io.emit("taskAddedToWorkspace", taskId);
    res.status(201).send("Task added to workspace");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

export const removeTaskFromWorkspace = async (req, res) => {
  const { workspaceId, taskId } = req.params;
  try {
    await Task.removeTaskFromWorkspace(taskId, workspaceId);
    io.emit("taskRemovedFromWorkspace", taskId);
    res.status(200).send("Task removed from workspace");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
