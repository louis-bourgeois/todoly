import express from "express";
import {
  addPreference,
  getUserPreferences,
  updatePreference,
} from "../controllers/preferenceControllers.js";

const router = express.Router();

router.post("/update", updatePreference);

router.post("/", addPreference);

router.get("/", getUserPreferences);

export default router;
