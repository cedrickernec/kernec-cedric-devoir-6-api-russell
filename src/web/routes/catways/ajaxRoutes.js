/**
 * ===================================================================
 * CATWAYS AJAX ROUTES (WEB)
 * ===================================================================
 */

import express from "express";

import {
    checkCatwayNumberAvailability,
    checkBulkCatwayDeleteAjax,
    deleteCatways
} from "../../controllers/catways/catwayAjaxController.js";

import { authGuard } from "../../middlewares/auth/authGuard.js";

const router = express.Router();

router.get("/check-number", authGuard, checkCatwayNumberAvailability);
router.post("/bulk-check", authGuard, checkBulkCatwayDeleteAjax);
router.delete("/bulk", authGuard, deleteCatways);

export default router;