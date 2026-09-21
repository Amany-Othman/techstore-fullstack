import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createOrder)
  .get(protect, isAdmin, getAllOrders);

router.route("/mine").get(protect, getMyOrders);

router.patch("/:id/status", protect, isAdmin, updateOrderStatus);

export default router;
