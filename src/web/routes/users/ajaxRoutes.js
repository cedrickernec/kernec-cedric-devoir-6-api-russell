/**
 * ===================================================================
 * USERS AJAX ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    checkEmailAvailability,
    deleteUsers
} from "../../controllers/users/userAjaxController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/check-email", authGuard, checkEmailAvailability);
router.delete("/", authGuard, deleteUsers);

export default router;