/**
 * CATWAYS FORM ROUTES (WEB)
 * =========================================================================================
 * @module formRoutes
 * 
 * Routeur des formulaires Catways (couche Web).
 *
 * - Protège les routes via authGuard
 * - Valide les paramètres dynamiques
 * - Délègue la logique aux contrôleurs Form
 * - Monte les sous-routes Réservations
 *
 * Routes principales :
 * POST /create
 * POST /:catwayNumber/edit
 *
 * Sous-ressource :
 * /:catwayNumber/reservations
 */

import express from "express";

import {
    postCreateCatway,
    postEditCatway
} from "../../controllers/catways/catwayFormController.js";
import nestedFormRoutes from "../reservations/nested/formRoutes.js";

import { validateNumberParam } from "../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

// Routes Catways
router.post("/create", authGuard, postCreateCatway);
router.post("/:catwayNumber/edit", authGuard, validateNumberParam("catwayNumber"), postEditCatway);

// Sous-ressource Réservations
router.use("/:catwayNumber/reservations", validateNumberParam("catwayNumber"), nestedFormRoutes);

export default router;