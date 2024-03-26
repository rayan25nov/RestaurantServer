import express from "express";
const router = express.Router();

import {requireAdmin} from "../middlewares/adminMiddleware.js";

import {
  getAllTables,
  createTable,
  getTablesStatus,
  changeTableStatus,
  reserveTable,
  releaseTable,
  deleteTable,
} from "../controllers/tableController.js";

router.get("/", getAllTables);
router.get("/:status", getTablesStatus);
router.put("/reserve/:id", reserveTable);
router.put("/release/:id", releaseTable);
router.put("/:id", changeTableStatus);
router.post("/", requireAdmin, createTable);
router.delete("/:id", requireAdmin, deleteTable);

export default router;
