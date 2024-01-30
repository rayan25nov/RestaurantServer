import express from "express";
const router = express.Router();

import requireAdmin from "../middlewares/adminMiddleware.js";

import {
  getAllTables,
  createTable,
  getTablesStatus,
  changeTableStatus,
  deleteTable,
} from "../controllers/tableController.js";

router.get("/", getAllTables);
router.get("/:status", getTablesStatus);
router.post("/", requireAdmin, createTable);
router.put("/:id", requireAdmin, changeTableStatus);
router.delete("/:id", requireAdmin, deleteTable);

export default router;
