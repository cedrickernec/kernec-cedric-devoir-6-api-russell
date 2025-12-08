import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Reservation from "../models/Reservation.js";

const router = Router();

// Lister toutes les réservations
router.get("/", authMiddleware, async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message })
    }
});

export default router;