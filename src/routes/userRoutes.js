import { Router } from "express";

import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    updatePassword
} from "../controllers/userControllers.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Routes User
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.put("/:id/password", authMiddleware, updatePassword);
router.get("/:id", authMiddleware, deleteUser);

export default router;