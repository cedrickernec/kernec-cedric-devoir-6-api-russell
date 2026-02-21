/**
 * ===================================================================
 * CATWAYS AJAX ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    checkCatwayNumberAvailability,
    deleteCatways
} from "../../controllers/catways/catwayAjaxController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/check-number", authGuard, checkCatwayNumberAvailability);
router.delete("/", authGuard, deleteCatways);

export default router;