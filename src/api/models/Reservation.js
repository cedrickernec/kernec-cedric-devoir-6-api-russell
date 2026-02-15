/**
 * ===================================================================
 * RESERVATION MODEL
 * ===================================================================
 * - Représente une réservation de catway
 * - Contient les informations client, bateau et période
 * ===================================================================
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