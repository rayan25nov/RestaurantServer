import express from "express";
const router = express.Router();

import {
  addOrder,
  getOrders,
  getAllOrders,
} from "../controllers/oldOrderController.js";

// middleware
import { requireAuth } from "../middlewares/adminMiddleware.js";

router.post("/", requireAuth, addOrder);
router.get("/", requireAuth, getOrders);
router.get("/all-orders", requireAuth, getAllOrders);

export default router;
