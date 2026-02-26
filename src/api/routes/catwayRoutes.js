/**
 * CATWAYS ROUTES (API)
 * =========================================================================================
 * @module catwayRoutes
 *
 * Déclare les routes API liées aux catways et monte la sous-ressource réservations.
 *
 * Fonctionnalités :
 * - CRUD catways
 * - Endpoints utilitaires (next-number, check-number)
 * - Endpoints bulk (bulk-check, bulk delete)
 * - Sous-ressource : /:id/reservations (routes imbriquées)
 *
 * Dépendances :
 * - catwayController
 * - authMiddleware
 * - reservationNestedRoutes
 * - Express Router
 *
 * Sécurité :
 * - Routes protégées via authMiddleware
 *
 * Effets de bord :
 * - Enregistrement de routes et middleware dans l’application
 */

import reservationRoutes from "./reservationNestedRoutes.js";

import { Router } from "express";

import {
    getAllCatways,
    getCatwayByNumber,
    getNextCatwayNumber,
    checkCatwayNumber,
    createCatway,
    updateCatway,
    checkCatwaysBeforeDelete,
    deleteCatwaysBulk,
    deleteCatway
} from "../controllers/catwayController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
// Routes Catways
router.get("/", authMiddleware, getAllCatways);
router.get("/next-number", authMiddleware, getNextCatwayNumber);
router.get("/check-number", authMiddleware, checkCatwayNumber);
router.post("/bulk-check", authMiddleware, checkCatwaysBeforeDelete);
router.delete("/bulk", authMiddleware, deleteCatwaysBulk);
router.get("/:id", authMiddleware, getCatwayByNumber);
router.post("/", authMiddleware, createCatway);
router.put("/:id", authMiddleware, updateCatway);
router.delete("/:id", authMiddleware, deleteCatway);

// Sous-ressource
router.use("/:id/reservations", reservationRoutes);

export default router;