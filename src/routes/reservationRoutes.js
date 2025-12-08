import { Router } from "express";

import {
    getReservationsForCatway,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
} from "../controllers/reservationControllers.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });

// Routes Reservation → /api/catways/:id/reservations
router.get("/", authMiddleware, getReservationsForCatway);
router.get("/:idReservation", authMiddleware, getReservationById);
router.post("/", authMiddleware, createReservation);
router.put("/:idReservation", authMiddleware, updateReservation);
router.delete("/:idReservation", authMiddleware, deleteReservation);

export default router;