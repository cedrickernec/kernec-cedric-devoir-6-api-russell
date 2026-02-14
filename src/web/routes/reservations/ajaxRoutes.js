/**
 * ===================================================================
 * RESERVATIONS AJAX ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    deleteReservations
} from "../../controllers/reservations/reservationAjaxController.js";

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.delete("/", authGuard, deleteReservations);

export default router;