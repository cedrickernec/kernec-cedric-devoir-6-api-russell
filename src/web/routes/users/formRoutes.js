/**
 * USERS FORM ROUTES (WEB)
 * =========================================================================================
 * @module formRoutes
 *
 * Routeur des formulaires Utilisateurs (couche Web).
 *
 * - Protège les routes via authGuard
 * - Valide les paramètres dynamiques (ObjectId)
 * - Délègue aux contrôleurs Form
 *
 * Routes :
 * POST /create
 * POST /:id/edit
 * POST /:id/edit/password
 */

import express from "express";

import {
    postCreateUser,
    postEditUser,
    postEditUserPassword
} from "../../controllers/users/userFormController.js";

import { validateMongoIdParam } from "../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateUser);
router.post("/:id/edit", authGuard, validateMongoIdParam("id"), postEditUser);
router.post("/:id/edit/password", authGuard, validateMongoIdParam("id"), postEditUserPassword);

export default router;