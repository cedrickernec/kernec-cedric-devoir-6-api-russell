import express from "express";
import {
    deleteReservations,
    deleteReservationById
} from "../../controllers/reservations/reservationsAjaxController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.delete("/", authGuard, deleteReservations);
router.delete("/:id", authGuard, deleteReservationById);

export default router;