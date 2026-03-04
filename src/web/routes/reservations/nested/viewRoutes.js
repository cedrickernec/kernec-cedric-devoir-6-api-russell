/**
 * RESERVATIONS NESTED ROUTES (WEB)
 * =========================================================================================
 * @module viewRoutes
 * 
 * Routeur des vues Réservations imbriquées (couche Web).
 *
 * - Dépend d’un catway : /catways/:catwayNumber/reservations
 * - mergeParams activé pour récupérer catwayNumber
 * - Protège les routes via authGuard
 * - Valide les ObjectId dynamiques
 * - Gère vues complètes et panneaux partiels
 *
 * Routes :
 * GET    /:id
 * GET    /:id/edit
 * GET    /:id/panel
 * DELETE /:id
 */

import express from "express";

import {
    getReservationById,
    getReservationPanel,
    getEditReservationPage
} from "../../../controllers/reservations/reservationViewController.js";

import { deleteReservationAction } from "../../../controllers/reservations/reservationFormController.js";

import { validateMongoIdParam } from "../../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../../middlewares/auth/authGuard.js";

const router = express.Router({ mergeParams: true });

router.get("/:id/edit", authGuard, validateMongoIdParam("id"), getEditReservationPage);
router.get("/:id/panel", authGuard, validateMongoIdParam("id"), getReservationPanel);
router.get("/:id", authGuard, validateMongoIdParam("id"), getReservationById);
router.delete("/:id", authGuard, validateMongoIdParam("id"), deleteReservationAction);

export default router;