/**
 * ===================================================================
 * CATWAYS FORM ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    postCreateCatway,
    postEditCatway
} from "../../controllers/catways/catwaysFormController.js";
import nestedFormRoutes from "../reservations/nested/form.routes.js";

import { validateNumberParam } from "../../middlewares/paramsValidators.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

// Routes Catways
router.post("/create", authGuard, postCreateCatway);

router.post("/:catwayNumber/edit", authGuard, validateNumberParam("catwayNumber"), postEditCatway);

// Sous-ressource Réservations
router.use("/:catwayNumber/reservations", validateNumberParam("catwayNumber"), nestedFormRoutes);

export default router;