import express from "express";
import {
  addTask,
  addTaskToWorkspace,
  checkTaskInWorkspace,
  deleteTask,
  getTask,
  removeTaskFromWorkspace,
  updateTask,
} from "../controllers/taskControllers.js";

const router = express.Router();

router.get("/", getTask);

router.post("/update", updateTask);

router.post("/add", addTask);

router.delete("/delete/:id", deleteTask);

router.get("/check/:taskId/:workspaceId", checkTaskInWorkspace);

router.post("/:workspaceId/tasks/:taskId", addTaskToWorkspace);

router.delete("/:workspaceId/tasks/:taskId", removeTaskFromWorkspace);

export default router;
