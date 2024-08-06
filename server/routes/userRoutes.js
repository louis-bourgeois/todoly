import express from "express";
import passport from "passport";
import {
  addUserToWorkspace,
  createUser,
  findUserbyUsername,
  getUserData,
  getWorkspacesByUserId,
  removeUserFromWorkspace,
} from "../controllers/userControllers.js";
import { hashPassword } from "../middleware/pasword.js";
const router = express.Router();

router.post("/", getUserData);
router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(403).send("Not authenticated");
  }
  return res.json({ user: req.user });
});
router.post("/find", findUserbyUsername);
router.post("/register", hashPassword, createUser);
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      if (err === "User not found") {
        return res.status(404).json({ err, user });
      } else {
        return res.status(401).json({ err: err, user: user });
      }
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed", reason: info.message });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: "Login successful", user: user });
    });
  })(req, res, next);
});

router.get("/workspaces", getWorkspacesByUserId);
router.post("/:workspaceId/users/:userId", addUserToWorkspace);
router.delete("/:workspaceId/users/:userId", removeUserFromWorkspace);

export default router;
