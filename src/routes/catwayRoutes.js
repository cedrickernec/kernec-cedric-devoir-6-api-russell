import { Router } from "express";

import {
    getAllCatways,
    getCatwayById,
    createCatway,
    updateCatway,
    deleteCatway
} from "../controllers/catwayController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
// Routes Catways
router.get("/", authMiddleware, getAllCatways);
router.get("/:id", authMiddleware, getCatwayById);
router.post("/", authMiddleware, createCatway);
router.put("/:id", authMiddleware, updateCatway);
router.delete("/:id", authMiddleware, deleteCatway);

export default router;