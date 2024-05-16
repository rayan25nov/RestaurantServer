import express from "express";
const router = express.Router();

import {
  placeOrder,
  getAllOrders,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "../controllers/orderController.js";

// middleware
import {
  requireAuth,
  requireChef,
} from "../middlewares/adminMiddleware.js";

router.post("/", requireAuth, placeOrder);
router.get("/", requireAuth, getOrders);
router.get("/all-orders", getAllOrders);
router.put("/:orderId", requireChef, updateOrderStatus);
router.put("/payment/:orderId", requireAuth, updatePaymentStatus);
router.delete("/:orderId", requireAuth, deleteOrder);

export default router;
