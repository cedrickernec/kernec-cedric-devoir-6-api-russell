/**
 * ===================================================================
 * RESERVATIONS GLOBAL ROUTES (API)
 * ===================================================================
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