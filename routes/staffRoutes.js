import express from "express";
const router = express.Router();
import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  loginStaff,
  logoutStaff,
  getStaffProfile,
} from "../controllers/staffController.js";

import { requireAdmin } from "../middlewares/adminMiddleware.js";

router.post("/login", loginStaff);
router.post("/logout", logoutStaff);
router.get("/profile", getStaffProfile);
router.get("/", requireAdmin, getAllStaff);
router.post("/", requireAdmin, createStaff);
router.patch("/:id", requireAdmin, updateStaff);
router.delete("/:id", requireAdmin, deleteStaff);

export default router;
