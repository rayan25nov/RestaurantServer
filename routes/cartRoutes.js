import express from "express";
const router = express.Router();

import {
  getAllCartItems,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from "../controllers/cartController.js";

router.get("/", getAllCartItems);
router.post("/", addItemToCart);
router.delete("/:id", removeItemFromCart);
router.delete("/", clearCart);

export default router;