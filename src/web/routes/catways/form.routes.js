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

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

// Routes Catways
router.post("/create", authGuard, postCreateCatway);
router.post("/:catwayNumber/edit", authGuard, postEditCatway);

// Sous-ressource Réservations
router.use("/:catwayNumber/reservations", nestedFormRoutes);

export default router;