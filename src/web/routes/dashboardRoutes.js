/**
 * ===================================================================
 * DASHBOARD ROUTE (WEB)
 * ===================================================================
 */

import express from "express";
import { getDashboard } from "../controllers/dashboardViewController.js";
import { authGuard } from "../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getDashboard);

export default router;