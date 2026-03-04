/**
 * USERS AJAX ROUTES (WEB)
 * =========================================================================================
 * @module ajaxRoutes
 *
 * Routeur AJAX des utilisateurs (couche Web).
 *
 * - Protège les routes via authGuard
 * - Expose uniquement des réponses JSON
 *
 * Routes :
 * GET    /check-email
 * DELETE /bulk
 */

import express from "express";

import {
    checkEmailAvailability,
    deleteUsers
} from "../../controllers/users/userAjaxController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/check-email", authGuard, checkEmailAvailability);
router.delete("/bulk", authGuard, deleteUsers);

export default router;