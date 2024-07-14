import express from "express";
import {
  addSection,
  deleteSection,
  getSection,
  updateSection,
} from "../controllers/sectionControllers_recover.js";

const router = express.Router();
router.get("/", getSection);
router.post("/add", addSection);
router.post("/update", updateSection);
router.delete("/delete/:id", deleteSection);

export default router;
