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
} from "../../../controllers/reservations/reservationViewController.js";

import { deleteReservationAction } from "../../../controllers/reservations/reservationFormController.js";

import { validateMongoIdParam } from "../../../middlewares/paramsValidators.js";
import { authGuard } from "../../../middlewares/authGuard.js";

const router = express.Router({ mergeParams: true });

router.get("/:id/edit", authGuard, validateMongoIdParam("id"), getEditReservationPage);
router.get("/:id/panel", authGuard, validateMongoIdParam("id"), getReservationPanel);
router.get("/:id", authGuard, validateMongoIdParam("id"), getReservationById);
router.delete("/:id", authGuard, validateMongoIdParam("id"), deleteReservationAction);

export default router;