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
import nestedViewRoutes from "../reservations/nested/view.routes.js";

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();
// Routes Catways
router.get("/", authGuard, getCatwaysPage);
router.get("/create", authGuard, getCreateCatwayPage);
router.get("/:catwayNumber", authGuard, getCatwayByNumber);
router.get("/:catwayNumber/edit", authGuard, getEditCatwayByNumber);
router.get("/:catwayNumber/panel", authGuard, getCatwayPanel);

// Sous-ressource Réservations
router.use("/:catwayNumber/reservations", nestedViewRoutes);

export default router;