import express from "express";
const router = express.Router();

import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  deleteAdminProfile,
} from "../controllers/admin.js";

import { requireAdmin } from "../middlewares/adminMiddleware.js";

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/logout", logoutAdmin);
// protected
router.get("/profile", requireAdmin, getAdminProfile);
router.patch("/profile", requireAdmin, updateAdminProfile);
router.delete("/profile", requireAdmin, deleteAdminProfile);

export default router;
