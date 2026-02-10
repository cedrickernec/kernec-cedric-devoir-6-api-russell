/**
 * ===================================================================
 * DASHBOARD ROUTE (WEB)
 * ===================================================================
 */

import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getDashboard);

export default router;