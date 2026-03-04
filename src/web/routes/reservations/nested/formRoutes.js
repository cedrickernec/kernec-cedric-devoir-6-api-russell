/**
 * RESERVATIONS NESTED ROUTES (WEB)
 * =========================================================================================
 * @module formRoutes
 * 
 * Routeur des formulaires Réservations imbriquées (couche Web).
 *
 * - Dépend d’un catway : /catways/:catwayNumber/reservations
 * - mergeParams activé pour récupérer catwayNumber
 * - Protège les routes via authGuard
 * - Valide les ObjectId dynamiques
 * - Délègue aux contrôleurs Form
 *
 * Route :
 * POST /:id/edit
 */

import express from "express";

import { postEditReservation } from "../../../controllers/reservations/reservationFormController.js";

import { validateMongoIdParam } from "../../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../../middlewares/auth/authGuard.js";

const router = express.Router({ mergeParams: true });

router.post("/:id/edit", authGuard, validateMongoIdParam("id"), postEditReservation);

export default router;