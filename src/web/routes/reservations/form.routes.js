/**
 * ===================================================================
 * RESERVATIONS FORM ROUTES (WEB)
 * ===================================================================
 * - Routes globales non dépendantes de catways
 * ===================================================================
 */

import express from "express";

import {
    postCreateReservation,
    cancelCreateReservation
} from "../../controllers/reservations/reservationsFormController.js";

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateReservation);
router.get("/create/cancel", authGuard, cancelCreateReservation);

export default router;