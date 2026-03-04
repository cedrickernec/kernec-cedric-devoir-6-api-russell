/**
 * RESERVATIONS GLOBAL ROUTES (API)
 * =========================================================================================
 * @module reservationGlobalRoutes
 *
 * Déclare les routes “globales” des réservations (non dépendantes d’un catway).
 *
 * Fonctionnalités :
 * - GET / : liste globale des réservations
 * - POST /availability : recherche de disponibilité sur période
 * - POST /bulk-check : contrôle avant suppression multiple
 * - DELETE /bulk : suppression multiple
 *
 * Dépendances :
 * - reservationController (getAllReservations, getReservationAvailability, checkReservationsBeforeDelete, deleteReservationsBulk)
 * - authMiddleware
 * - Express Router
 *
 * Sécurité :
 * - Routes protégées via authMiddleware
 */

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getAllReservations,
    getReservationAvailability,
    checkReservationsBeforeDelete,
    deleteReservationsBulk
} from "../controllers/reservationController.js";

const router = Router();

router.get("/", authMiddleware, getAllReservations);
router.post("/availability", authMiddleware, getReservationAvailability)
router.post("/bulk-check", authMiddleware, checkReservationsBeforeDelete)
router.delete("/bulk", authMiddleware, deleteReservationsBulk)

export default router;