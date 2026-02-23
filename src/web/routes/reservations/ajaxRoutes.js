/**
 * ===================================================================
 * RESERVATIONS AJAX ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    deleteReservations,
    checkBulkReservationDeleteAjax
} from "../../controllers/reservations/reservationAjaxController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.post("/bulk-check", authGuard, checkBulkReservationDeleteAjax);
router.delete("/bulk", authGuard, deleteReservations);

export default router;