/**
 * DASHBOARD ROUTE (WEB)
 * =========================================================================================
 * @module dashboardRoutes
 *
 * Routeur du dashboard utilisateur (couche Web).
 *
 * - Protège la route via authGuard
 * - Rend la page dashboard
 *
 * Route :
 * GET /
 */

import express from "express";
import { getDashboard } from "../controllers/dashboardViewController.js";
import { authGuard } from "../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getDashboard);

export default router;