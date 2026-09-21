import express from "express";
import { getStats } from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, isAdmin, getStats);

export default router;
