import express from "express";
import {
    getUsersPage,
    getCreateUserPage,
    getEditUserPage,
    getUserById,
    getUserPanel
} from "../../controllers/users/usersViewController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getUsersPage);
router.get("/create", authGuard, getCreateUserPage);
router.get("/:id/edit", authGuard, getEditUserPage);
router.get("/:id/panel", authGuard, getUserPanel);
router.get("/:id", authGuard, getUserById);

export default router;