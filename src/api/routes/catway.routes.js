/**
 * ===================================================================
 * CATWAYS ROUTES (API)
 * ===================================================================
 */

import reservationRoutes from "./reservationNested.routes.js";

import { Router } from "express";

import {
    getAllCatways,
    getCatwayByNumber,
    createCatway,
    updateCatway,
    deleteCatway
} from "../controllers/catwayController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
// Routes Catways
router.get("/", authMiddleware, getAllCatways);
router.get("/:id", authMiddleware, getCatwayByNumber);
router.post("/", authMiddleware, createCatway);
router.put("/:id", authMiddleware, updateCatway);
router.delete("/:id", authMiddleware, deleteCatway);

// Sous-ressource
router.use("/:id/reservations", reservationRoutes);

export default router;