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

import { validateMongoIdParam } from "../../middlewares/paramsValidators.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateUser);
router.post("/:id/edit", authGuard, validateMongoIdParam("id"), postEditUser);
router.post("/:id/edit/password", authGuard, validateMongoIdParam("id"), postEditUserPassword);

export default router;