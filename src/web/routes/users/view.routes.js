/**
 * ===================================================================
 * USERS VIEW ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    getUsersPage,
    getCreateUserPage,
    getEditUserPage,
    getUserById,
    getUserPanel
} from "../../controllers/users/usersViewController.js";

import { deleteUserAction } from "../../controllers/users/usersFormController.js";

import { validateMongoIdParam } from "../../middlewares/paramsValidators.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getUsersPage);
router.get("/create", authGuard, getCreateUserPage);

router.get("/:id/edit", authGuard, validateMongoIdParam("id"), getEditUserPage);
router.get("/:id/panel", authGuard, validateMongoIdParam("id"), getUserPanel);
router.get("/:id", authGuard, validateMongoIdParam("id"), getUserById);

router.delete("/:id", authGuard, validateMongoIdParam("id"), deleteUserAction);

export default router;