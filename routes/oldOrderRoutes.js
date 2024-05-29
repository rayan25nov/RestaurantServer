import express from "express";
const router = express.Router();

import {
  addOrder,
  getOrders,
  getAllOrders,
  getAllOrdersOfAllUser,
} from "../controllers/oldOrderController.js";

// middleware
import { requireStaff, requireAuth } from "../middlewares/adminMiddleware.js";

router.post("/", requireAuth, addOrder);
router.get("/", requireAuth, getOrders);
router.get("/all-orders", requireAuth, getAllOrders);
router.get("/admin/all-orders", requireStaff, getAllOrdersOfAllUser);

export default router;
