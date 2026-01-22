import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getAllReservations } from "../controllers/reservationControllers.js";

const router = Router();
// Lister toutes les réservations
router.get("/", authMiddleware, getAllReservations);

export default router;