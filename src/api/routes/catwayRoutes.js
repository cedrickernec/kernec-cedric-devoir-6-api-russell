/**
 * ===================================================================
 * CATWAYS ROUTES (API)
 * ===================================================================
 */

import reservationRoutes from "./reservationNestedRoutes.js";

import { Router } from "express";

import {
    getAllCatways,
    getCatwayByNumber,
    getNextCatwayNumber,
    createCatway,
    updateCatway,
    deleteCatway
} from "../controllers/catwayController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
// Routes Catways
router.get("/", authMiddleware, getAllCatways);
router.get("/next-number", authMiddleware, getNextCatwayNumber);
router.get("/:id", authMiddleware, getCatwayByNumber);
router.post("/", authMiddleware, createCatway);
router.put("/:id", authMiddleware, updateCatway);
router.delete("/:id", authMiddleware, deleteCatway);

// Sous-ressource
router.use("/:id/reservations", reservationRoutes);

export default router;