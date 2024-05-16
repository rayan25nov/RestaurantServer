import express from "express";
const router = express.Router();

import {
  giveFeedback,
  getAllFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";

import { requireAuth } from "../middlewares/adminMiddleware.js";

router.post("/", requireAuth, giveFeedback);
router.get("/all", getAllFeedbacks);
router.get("/:id", getFeedback);
router.patch("/", requireAuth, updateFeedback);
router.delete("/", requireAuth, deleteFeedback);

export default router;
