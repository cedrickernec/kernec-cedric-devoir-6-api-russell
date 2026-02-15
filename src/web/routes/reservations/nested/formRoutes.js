/**
 * ===================================================================
 * RESERVATIONS NESTED ROUTES (WEB)
 * ===================================================================
 * - Routes POST dépendantes de catways :
 *      - /catways/:catwayNumber/reservations
 * ===================================================================
 */

import express from "express";

import { postEditReservation } from "../../../controllers/reservations/reservationFormController.js";

import { validateMongoIdParam } from "../../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../../middlewares/auth/authGuard.js";

const router = express.Router({ mergeParams: true });

router.post("/:id/edit", authGuard, validateMongoIdParam("id"), postEditReservation);

export default router;