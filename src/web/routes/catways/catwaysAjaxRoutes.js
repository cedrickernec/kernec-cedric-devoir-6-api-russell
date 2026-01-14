import express from "express";
import {
    deleteCatways,
    deleteCatwayById,
    checkCatwayNumberAvailability
} from "../../controllers/catways/catwaysAjaxController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/check-number", authGuard, checkCatwayNumberAvailability);
router.delete("/", authGuard, deleteCatways);
router.delete("/:id", authGuard, deleteCatwayById);

export default router;