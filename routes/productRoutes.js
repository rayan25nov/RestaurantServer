import express from "express";
const router = express.Router();

import {
  getAllProducts,
  getProduct,
  getSpecialProducts,
  getProductsByCategory,
  getProductsByType,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {requireAdmin} from "../middlewares/adminMiddleware.js";

router.get("/", getAllProducts);
router.get("/special", getSpecialProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/type/:type", getProductsByType);
router.post("/", requireAdmin, createProduct);
router.patch("/:id", requireAdmin, updateProduct);
router.delete("/:id", requireAdmin, deleteProduct);

export default router;
