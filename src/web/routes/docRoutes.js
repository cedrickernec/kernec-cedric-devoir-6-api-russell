/**
 * DOUCMENTATION ROUTE (WEB)
 * =========================================================================================
 * @module docRoutes
 *
 * Routeur de la documentation (couche Web).
 *
 * - Route publique
 * - Rend la page de documentation
 *
 * Route :
 * GET /
 */

import { Router } from "express";
import { getDocumentation } from "../controllers/docViewController.js";
import { publicPage } from "../middlewares/ui/publicPage.js";

const router = Router();

router.get("/", publicPage, getDocumentation);

export default router;