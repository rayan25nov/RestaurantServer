import express from "express";
const router = express.Router();

import { getAllOrders, createOrder } from "../controllers/orderController.js";

router.get("/", getAllOrders);
router.post("/", createOrder);

export default router;