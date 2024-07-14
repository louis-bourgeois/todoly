import express from "express";
import {
  addTag,
  deleteTag,
  getTag,
  updateTag,
} from "../controllers/tagControllers.js";

const router = express.Router();

router.get("/", getTag);

router.post("/update", updateTag);

router.post("/add", addTag);

router.delete("/delete/:id", deleteTag);

export default router;
