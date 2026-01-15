import express from "express";
import {
    postCreateReservation,
    postEditReservation,
    cancelCreateReservation
} from "../../controllers/reservations/reservationFormController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateReservation);
router.post("/create/cancel", authGuard, cancelCreateReservation);
router.post("/:id/edit", authGuard, postEditReservation);

export default router;