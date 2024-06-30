
import express from "express";
import {
  addSection,
  deleteSection,
  updateSection,
} from "../controllers/sectionControllers_recover.js";

const router = express.Router();

router.post("/add", addSection);
router.post("/update", updateSection);
router.delete("/delete/:id", deleteSection);

export default router;
