/**
 * AUTHENTIFICATION ROUTES (API)
 * =========================================================================================
 * @module authRoutes
 *
 * Définit les endpoints d’authentification de l’API.
 *
 * Fonctionnalités :
 * - POST /login : authentification et émission de tokens
 * - POST /logout : invalidation logique côté client
 * - POST /refresh : renouvellement du token d’accès
 *
 * Dépendances :
 * - authController (login, logout, refreshToken)
 * - Express Router
 */

import express from "express";
import { login, logout, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router;