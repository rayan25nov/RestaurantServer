import express from "express";
const router = express.Router();

import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/admin.js";

import { requireAdmin } from "../middlewares/adminMiddleware.js";

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);
// protected
router.get("/profile", requireAdmin, getAdminProfile);
router.patch("/profile", requireAdmin, updateAdminProfile);
router.delete("/profile", requireAdmin, deleteAdminProfile);
router.post("/forgot-password", forgotPassword);
router.patch("/:id/reset-password/:token", resetPassword);

export default router;
