/**
 * CATWAYS VIEW ROUTES (WEB)
 * =========================================================================================
 * @module viewRoutes
 * 
 * Routeur des vues Catways (couche Web).
 *
 * - Protège les routes via authGuard
 * - Valide les paramètres dynamiques
 * - Délègue la logique aux contrôleurs View
 * - Gère le rendu EJS complet et partiels
 * - Monte les sous-routes Réservations
 *
 * Routes principales :
 * GET    /
 * GET    /create
 * GET    /:catwayNumber
 * GET    /:catwayNumber/edit
 * GET    /:catwayNumber/panel
 * DELETE /:catwayNumber
 *
 * Sous-ressource :
 * /:catwayNumber/reservations
 */

import express from "express";

import {
    getCatwaysPage,
    getCatwayByNumber,
    getCatwayPanel,
    getCreateCatwayPage,
    getEditCatwayByNumber
} from "../../controllers/catways/catwayViewController.js";

import { deleteCatwayAction } from "../../controllers/catways/catwayFormController.js";

import nestedViewRoutes from "../reservations/nested/viewRoutes.js";

import { validateNumberParam } from "../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();
// Routes Catways
router.get("/", authGuard, getCatwaysPage);
router.get("/create", authGuard, getCreateCatwayPage);

router.get("/:catwayNumber", authGuard, validateNumberParam("catwayNumber"), getCatwayByNumber);
router.get("/:catwayNumber/edit", authGuard, validateNumberParam("catwayNumber"), getEditCatwayByNumber);
router.get("/:catwayNumber/panel", authGuard, validateNumberParam("catwayNumber"), getCatwayPanel);

router.delete("/:catwayNumber", authGuard, validateNumberParam("catwayNumber"), deleteCatwayAction);

// Sous-ressource Réservations
router.use("/:catwayNumber/reservations", validateNumberParam("catwayNumber"), nestedViewRoutes);

export default router;