/**
 * RESERVATIONS NESTED ROUTES (API)
 * =========================================================================================
 * @module reservationNestedRoutes
 *
 * Déclare les routes de réservation dépendantes d’un catway (sous-ressource).
 *
 * Format attendu :
 * - Préfixe monté par catwayRoutes : /api/catways/:id/reservations
 *
 * Fonctionnalités :
 * - GET / : liste des réservations d’un catway
 * - GET /:idReservation : détail d’une réservation
 * - POST / : création
 * - PUT /:idReservation : mise à jour
 * - DELETE /:idReservation : suppression
 *
 * Dépendances :
 * - reservationController
 * - authMiddleware
 * - Express Router (mergeParams=true)
 *
 * Sécurité :
 * - Routes protégées via authMiddleware
 *
 * Effets de bord :
 * - mergeParams active la récupération de :id depuis le routeur parent
 */

import { Router } from "express";

import {
    getReservationsByCatway,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
} from "../controllers/reservationController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });
// Routes Reservation → /api/catways/:id/reservations
router.get("/", authMiddleware, getReservationsByCatway);
router.get("/:idReservation", authMiddleware, getReservationById);
router.post("/", authMiddleware, createReservation);
router.put("/:idReservation", authMiddleware, updateReservation);
router.delete("/:idReservation", authMiddleware, deleteReservation);

export default router;