import express from "express";
import { getStatistics } from "../controllers/statsControllers.js";

const router = express.Router();

router.get("/overview", getStatistics);

export default router;
