/**
 * ===================================================================
 * RESERVATIONS NESTED ROUTES (WEB)
 * ===================================================================
 * - Routes GET dépendantes de catways :
 *      - /catways/:catwayNumber/reservations
 * ===================================================================
 */

import express from "express";

import {
    getReservationById,
    getReservationPanel,
    getEditReservationPage
} from "../../../controllers/reservations/reservationsViewController.js";

import { authGuard } from "../../../middlewares/authGuard.js";

const router = express.Router({ mergeParams: true });

router.get("/:id/edit", authGuard, getEditReservationPage);
router.get("/:id/panel", authGuard, getReservationPanel);
router.get("/:id", authGuard, getReservationById);

export default router;