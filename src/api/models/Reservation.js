/**
 * RESERVATION MODEL
 * =========================================================================================
 * @module Reservation
 *
 * Modèle Mongoose représentant une réservation de catway.
 *
 * Responsabilités :
 * - Définir la structure persistée d’une réservation
 * - Encadrer les contraintes de validation (required, enum, type Date)
 * - Stocker les informations client, bateau et période
 *
 * Dépendances :
 * - mongoose
 *
 * Sécurité :
 * - Validation de schéma côté base (required, enum)
 *
 * Effets de bord :
 * - Persistance en base MongoDB via Mongoose
 */

import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
    },
    catwayType: {
        type: String,
        enum: ["short", "long"]
    },
    clientName: {
        type: String,
        required: true,
    },
    boatName: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
},
{
    timestamps: true
}
);

export default mongoose.model("Reservation", ReservationSchema);