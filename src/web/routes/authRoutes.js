/**
 * AUTHENTIFICATION ROUTES (WEB)
 * =========================================================================================
 * @module authRoutes
 *
 * Routeur d'authentification (couche Web).
 *
 * - Gère la connexion et la déconnexion
 * - Gère le keep-alive de session
 *
 * Routes :
 * POST /login
 * GET  /logout
 * POST /keep-alive
 */

import express from "express";
import { postLogin, getLogout } from "../controllers/authController.js";
import { keepAlive } from "../controllers/sessionController.js";
import { authGuard } from "../middlewares/auth/authGuard.js";

const router = express.Router();

router.post("/login", postLogin);
router.get("/logout", getLogout);
router.post("/keep-alive", authGuard, keepAlive);

export default router;