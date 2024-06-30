import express from "express";
import { addTag, deleteTag, updateTag } from "../controllers/tagControllers.js";

const router = express.Router();

router.post("/update", updateTag);

router.post("/add", addTag);

router.delete("/delete/:id", deleteTag);

export default router;
