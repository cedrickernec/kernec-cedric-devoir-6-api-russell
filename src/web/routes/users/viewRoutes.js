/**
 * USERS VIEW ROUTES (WEB)
 * =========================================================================================
 * @module viewRoutes
 *
 * Routeur des vues Utilisateurs (couche Web).
 *
 * - Protège les routes via authGuard
 * - Valide les paramètres dynamiques (ObjectId)
 * - Rend les pages EJS et panneaux partiels
 *
 * Routes :
 * GET    /
 * GET    /create
 * GET    /:id
 * GET    /:id/edit
 * GET    /:id/panel
 * DELETE /:id
 */

import express from "express";

import {
    getUsersPage,
    getCreateUserPage,
    getEditUserPage,
    getUserById,
    getUserPanel
} from "../../controllers/users/userViewController.js";

import { deleteUserAction } from "../../controllers/users/userFormController.js";

import { validateMongoIdParam } from "../../middlewares/request/paramsValidators.js";
import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getUsersPage);
router.get("/create", authGuard, getCreateUserPage);

router.get("/:id/edit", authGuard, validateMongoIdParam("id"), getEditUserPage);
router.get("/:id/panel", authGuard, validateMongoIdParam("id"), getUserPanel);
router.get("/:id", authGuard, validateMongoIdParam("id"), getUserById);

router.delete("/:id", authGuard, validateMongoIdParam("id"), deleteUserAction);

export default router;