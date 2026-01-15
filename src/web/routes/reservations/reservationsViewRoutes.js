import express from "express";
import {
    getReservationsPage,
    getReservationById,
    getCreateReservationPage,
    getEditReservationPage,
    getReservationPanel,
} from "../../controllers/reservations/reservationsViewController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getReservationsPage);
router.get("/create", authGuard, getCreateReservationPage);
router.get("/:id/edit", authGuard, getEditReservationPage);
router.get("/:id/panel", authGuard, getReservationPanel);
router.get("/:id", authGuard, getReservationById);

export default router;