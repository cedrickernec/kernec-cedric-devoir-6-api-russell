/**
 * ===================================================================
 * CATWAYS VIEW ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    getCatwaysPage,
    getCatwayByNumber,
    getCatwayPanel,
    getCreateCatwayPage,
    getEditCatwayByNumber
} from "../../controllers/catways/catwaysViewController.js";

import { deleteCatwayAction } from "../../controllers/catways/catwaysFormController.js";

import nestedViewRoutes from "../reservations/nested/view.routes.js";

import { validateNumberParam } from "../../middlewares/paramsValidators.js";
import { authGuard } from "../../middlewares/authGuard.js";

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