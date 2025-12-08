import Reservation from "../models/Reservation.js";
import Catway from "../models/Catway.js";
import { validateReservationData } from "../utils/validators/reservationValidators.js";

// =========================================
// RÉCUPÉRER TOUTES LES RÉSERVATIONS D’UN CATWAY
// =========================================
export const getReservationsForCatway = async (req, res) => {
    try {
        const { id: catwayNumber } = req.params;

        const reservations = await Reservation.find({ catwayNumber });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// =========================================
// RÉCUPÉRER UNE RÉSERVATION PAR ID
// =========================================
export const getReservationById = async (req, res) => {
    try {
        const { id: catwayNumber, idReservation } = req.params;

        const reservation = await Reservation.findOne({
            _id: idReservation,
            catwayNumber,
        });

        if (!reservation) {
            return res.status(404).json({ message: "Réservation introuvable." });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// =========================================
// CRÉER UNE RÉSERVATION
// =========================================
export const createReservation = async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        req.body.catwayNumber = catwayNumber;

        // 1) Validation
        const errors = validateReservationData(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Données invalides", errors });
        }

        // 2) Vérifier que le catway existe
        const catway = await Catway.findOne({ catwayNumber });
        if (!catway) {
            return res.status(404).json({
                message: "Catway inexistant.",
                detail: `Aucun catway ne correspond au numéro ${catwayNumber}.`,
            });
        }

        // 3) Vérifier si hors service
        const state = catway.catwayState.toLowerCase();
        if (
            state.includes("réparation") ||
            state.includes("indisponible") ||
            state.includes("ne peut être réservé") ||
            state.includes("hors service")
        ) {
            return res.status(400).json({
                message: "Catway hors service.",
                catwayState: catway.catwayState,
            });
        }

        // 4) Vérifier conflits
        const start = new Date(req.body.startDate);
        const end = new Date(req.body.endDate);

        const conflict = await Reservation.findOne({
            catwayNumber,
            startDate: { $lt: end },
            endDate: { $gt: start },
        });

        if (conflict) {
            return res.status(400).json({
                message: "Ce catway est déjà réservé sur ce créneau.",
                conflictWith: conflict,
            });
        }

        // 5) Création
        const newReservation = await Reservation.create(req.body);

        res.status(201).json({
            message: "Réservation créée avec succès.",
            reservation: newReservation,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// =========================================
// MODIFIER UNE RÉSERVATION
// =========================================
export const updateReservation = async (req, res) => {
    try {
        const { id: catwayNumber, idReservation } = req.params;

        const existing = await Reservation.findOne({
            _id: idReservation,
            catwayNumber,
        });

        if (!existing) {
            return res.status(404).json({ message: "Réservation introuvable." });
        }

        const updated = await Reservation.findByIdAndUpdate(
            idReservation,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Réservation mise à jour",
            reservation: updated,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// =========================================
// SUPPRIMER UNE RÉSERVATION
// =========================================
export const deleteReservation = async (req, res) => {
    try {
        const { id: catwayNumber, idReservation } = req.params;

        const deleted = await Reservation.findOneAndDelete({
            _id: idReservation,
            catwayNumber,
        });

        if (!deleted) {
            return res.status(404).json({ message: "Réservation introuvable." });
        }

        res.status(200).json({ message: "Réservation supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};