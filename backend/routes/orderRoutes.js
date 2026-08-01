import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    } from "../controllers/orderController.js";

import { protect, isAdmin } from "../middleware/authMiddleware.js";    
const router = express.Router();

router.route("/")
    .post(protect,createOrder)
    .get(protect,isAdmin,getAllOrders);

router.route("/mine").get(protect,getMyOrders);    


export default router;