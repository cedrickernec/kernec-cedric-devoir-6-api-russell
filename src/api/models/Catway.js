/**
 * ===================================================================
 * CATWAY MODEL
 * ===================================================================
 * - Représente un emplacement d'amarrage (catway)
 * - Définit les caractéristiques et l'état de disponibilité
 * ===================================================================
 */

import mongoose from "mongoose";

const CatwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    catwayType: {
        type: String,
        enum: ["short", "long"],
        required: true,
    },
    catwayState: {
        type: String,
        required: true,
    },
    isOutOfService: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
}
);

// ===============================================
// INSTANCE METHODS
// ===============================================

// Indique si le catway est indisponible
CatwaySchema.methods.isUnavailable = function () {
    return this.isOutOfService === true;
};

export default mongoose.model("Catway", CatwaySchema);