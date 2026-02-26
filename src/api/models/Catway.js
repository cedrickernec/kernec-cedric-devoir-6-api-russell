/**
 * CATWAY MODEL
 * =========================================================================================
 * @module Catway
 *
 * Modèle Mongoose représentant un emplacement d’amarrage (catway).
 *
 * Responsabilités :
 * - Définir la structure persistée d’un catway
 * - Encadrer les contraintes de validation (required, enum, unique)
 * - Fournir des méthodes métier liées à l’entité
 *
 * Dépendances :
 * - mongoose
 *
 * Sécurité :
 * - Validation de schéma côté base (required, enum, unique)
 *
 * Effets de bord :
 * - Persistance en base MongoDB via Mongoose
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

/**
 * CATWAY INSTANCE METHOD - IS UNAVAILABLE
 * =========================================================================================
 * Indique si le catway est actuellement indisponible.
 *
 * @function isUnavailable
 *
 * @this {import("mongoose").Document}
 *
 * @returns {boolean}
 */

CatwaySchema.methods.isUnavailable = function () {
    return this.isOutOfService === true;
};

export default mongoose.model("Catway", CatwaySchema);