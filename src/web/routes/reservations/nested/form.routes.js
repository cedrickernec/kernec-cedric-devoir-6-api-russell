/**
 * ===================================================================
 * RESERVATIONS NESTED ROUTES (WEB)
 * ===================================================================
 * - Routes POST dépendantes de catways :
 *      - /catways/:catwayNumber/reservations
 * ===================================================================
 */

import express from "express";
import { postEditReservation } from "../../../controllers/reservations/reservationsFormController.js";
import { authGuard } from "../../../middlewares/authGuard.js";

const router = express.Router({ mergeParams: true });

router.post("/:id/edit", authGuard, postEditReservation);

export default router;