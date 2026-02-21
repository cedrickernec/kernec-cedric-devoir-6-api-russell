/**
 * ===================================================================
 * AUTHENTIFICATION ROUTES (WEB)
 * ===================================================================
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