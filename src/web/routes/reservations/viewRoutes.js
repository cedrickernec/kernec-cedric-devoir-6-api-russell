/**
 * ===================================================================
 * RESERVATIONS VIEW ROUTES (WEB)
 * ===================================================================
 * - Routes globales non dépendantes de catways
 * ===================================================================
 */

import express from "express";

import {
    getCreateReservationPage,
    getReservationsPage
} from "../../controllers/reservations/reservationViewController.js";

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getReservationsPage);
router.get("/create", authGuard, getCreateReservationPage);

export default router;