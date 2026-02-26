/**
 * RESERVATIONS FORM ROUTES (WEB)
 * =========================================================================================
 * @module formRoutes
 * 
 * Routeur des formulaires Réservations (couche Web).
 *
 * - Routes globales non dépendantes d’un catway
 * - Protège les routes via authGuard
 * - Délègue la logique aux contrôleurs Form
 *
 * Routes :
 * POST /create
 * GET  /create/cancel
 */

import express from "express";

import {
    postCreateReservation,
    cancelCreateReservation
} from "../../controllers/reservations/reservationFormController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateReservation);
router.get("/create/cancel", authGuard, cancelCreateReservation);

export default router;