import { Router } from "express";

import {
    getReservationsByCatway,
    getReservationById,
    createReservation,
    updateReservation,
    deleteReservation
} from "../controllers/reservationControllers.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router({ mergeParams: true });
// Routes Reservation → /api/catways/:id/reservations
router.get("/", authMiddleware, getReservationsByCatway);
router.get("/:idReservation", authMiddleware, getReservationById);
router.post("/", authMiddleware, createReservation);
router.put("/:idReservation", authMiddleware, updateReservation);
router.delete("/:idReservation", authMiddleware, deleteReservation);

export default router;