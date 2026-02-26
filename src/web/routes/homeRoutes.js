/**
 * HOME ROUTES (WEB)
 * =========================================================================================
 * @module homeRoutes
 *
 * Routeur des pages publiques principales.
 *
 * - Page d’accueil
 * - Page de connexion
 * - Accessible sans authentification (publicPage)
 *
 * Routes :
 * GET /
 * GET /login
 */

import express from "express";
import { getHomeView } from "../controllers/homeViewController.js";
import { publicPage } from "../middlewares/ui/publicPage.js";

const router = express.Router();

router.get("/", publicPage, getHomeView);
router.get("/login", publicPage, getHomeView);

export default router;