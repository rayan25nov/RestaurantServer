import express from "express";
const router = express.Router();

import {
  capturePayment,
  verifyPayment,
  getRazorpayKey,
} from "../controllers/paymentController.js";
import { requireAuth } from "../middlewares/adminMiddleware.js";

router.post("/capture-payment", requireAuth, capturePayment);
router.post("/verify-payment", verifyPayment);
router.get("/razorpay-key", requireAuth, getRazorpayKey);

export default router;

