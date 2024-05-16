import express from "express";
const router = express.Router();

import {
  getAllCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";

// middleware
import { requireAuth } from "../middlewares/adminMiddleware.js";

router.get("/", requireAuth, getAllCartItems);
router.post("/add", requireAuth, addItemToCart);
router.put("/update/:productId", requireAuth, updateCartItemQuantity);
router.delete("/remove/:productId", requireAuth, removeItemFromCart);
router.delete("/clear", requireAuth, clearCart);

export default router;
