/**
 * RESERVATIONS VIEW ROUTES (WEB)
 * =========================================================================================
 * @module viewRoutes
 * 
 * Routeur des vues Réservations (couche Web).
 *
 * - Routes globales non dépendantes d’un catway
 * - Protège les routes via authGuard
 * - Délègue aux contrôleurs View
 * - Rend les pages EJS
 *
 * Routes :
 * GET /
 * GET /create
 */

import express from "express";

import {
    getCreateReservationPage,
    getReservationsPage
} from "../../controllers/reservations/reservationViewController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getReservationsPage);
router.get("/create", authGuard, getCreateReservationPage);

export default router;