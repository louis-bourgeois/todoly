import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  getTasksByWorkspaceId,
  getUsersByWorkspaceId,
  updateWorkspace,
} from "../controllers/workspaceControllers.js";

const router = express.Router();

router.post("/", createWorkspace);
router.post("/update/:id", updateWorkspace);
router.delete("/:workspaceId", deleteWorkspace);
router.get("/:workspaceId/users", getUsersByWorkspaceId);
router.get("/:workspaceId/tasks", getTasksByWorkspaceId);

export default router;
