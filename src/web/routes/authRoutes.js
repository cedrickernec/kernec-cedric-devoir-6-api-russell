/**
 * ===================================================================
 * AUTHENTIFICATION ROUTES (WEB)
 * ===================================================================
 */

import express from "express";
import { postLoginView, getLogoutView } from "../controllers/authViewController.js";
import { keepAlive } from "../controllers/sessionController.js";
import { authGuard } from "../middlewares/authGuard.js";

const router = express.Router();

router.post("/login", postLoginView);
router.get("/logout", getLogoutView);
router.post("/keep-alive", authGuard, keepAlive);

export default router;