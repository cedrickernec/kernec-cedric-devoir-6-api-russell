/**
 * ===================================================================
 * USERS FORM ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    postCreateUser,
    postEditUser,
    postEditUserPassword
} from "../../controllers/users/usersFormController.js";

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateUser);
router.post("/:id/edit", authGuard, postEditUser);
router.post("/:id/edit/password", authGuard, postEditUserPassword);

export default router;