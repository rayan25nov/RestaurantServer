import express from "express";
const router = express.Router();

import {
  getAllOrders,
  getOrders,
  placeOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

router.get("/", getAllOrders);
router.get("/:tableNumber", getOrders);
router.post("/place-order/:tableNumber", placeOrder);
router.put("/update-status/:orderId", updateOrderStatus);
router.delete("/delete-order/:orderId", deleteOrder);

export default router;
