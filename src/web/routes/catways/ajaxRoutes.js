/**
 * CATWAYS AJAX ROUTES (WEB)
 * =========================================================================================
 * @module ajaxRoutes
 * 
 * Routeur AJAX des catways (couche Web).
 *
 * - Protège les routes via authGuard
 * - Délègue la logique aux contrôleurs AJAX
 * - Expose uniquement des réponses JSON
 *
 * Routes :
 * GET    /check-number
 * POST   /bulk-check
 * DELETE /bulk
 */

import express from "express";

import {
    checkCatwayNumberAvailability,
    checkBulkCatwayDeleteAjax,
    deleteCatways
} from "../../controllers/catways/catwayAjaxController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/check-number", authGuard, checkCatwayNumberAvailability);
router.post("/bulk-check", authGuard, checkBulkCatwayDeleteAjax);
router.delete("/bulk", authGuard, deleteCatways);

export default router;