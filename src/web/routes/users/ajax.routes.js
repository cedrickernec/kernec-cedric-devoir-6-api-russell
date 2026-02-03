/**
 * ===================================================================
 * USERS AJAX ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    checkEmailAvailability,
    deleteUsers,
    deleteUserById
} from "../../controllers/users/usersAjaxController.js";

import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/check-email", authGuard, checkEmailAvailability);
router.delete("/", authGuard, deleteUsers);
router.delete("/:id", authGuard, deleteUserById);

export default router;