import express from "express";
const router = express.Router();
import {
  signupHandler,
  signinHandler,
  logoutHandler,
  verifyToken,
  getProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
  deleteUser,
} from "../controllers/userController.js";

// middleware
import { requireAuth } from "../middlewares/adminMiddleware.js";

// router.post("/sendotp", sendOtp);
router.post("/signin", signinHandler);
router.post("/signup", signupHandler);
router.post("/logout", logoutHandler);
router.get("/:id/verify/:token", verifyToken);
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfileImage);
router.post("/forgot-password", forgotPassword);
router.post("/:id/reset-password/:token", resetPassword);
router.delete("/:id", requireAuth, deleteUser);

export default router;
