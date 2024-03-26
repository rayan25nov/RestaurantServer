import express from "express";
const router = express.Router();

import {
  getAllCartItems,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";

router.get("/:tableNumber", getAllCartItems);
router.post("/addToCart/:tableNumber", addItemToCart);
router.put("/updateCart/:tableNumber", updateCartItemQuantity);
router.delete("/removeFromCart/:tableNumber/:productId", removeItemFromCart);
router.delete("/clearCart/:tableNumber", clearCart);

export default router;
