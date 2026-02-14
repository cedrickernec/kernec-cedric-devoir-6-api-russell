/**
 * ===================================================================
 * RESERVATIONS GLOBAL ROUTES (API)
 * ===================================================================
 */

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getAllReservations,
    getReservationAvailability
} from "../controllers/reservationController.js";

const router = Router();
// Lister toutes les réservations
router.get("/", authMiddleware, getAllReservations);

// Récupérer les disponibilités
router.post("/availability", authMiddleware, getReservationAvailability)

export default router;