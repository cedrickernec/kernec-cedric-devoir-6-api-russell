/**
 * USER MODEL
 * =========================================================================================
 * @module User
 *
 * Modèle Mongoose représentant un utilisateur de l’application.
 *
 * Responsabilités :
 * - Définir la structure persistée d’un utilisateur
 * - Stocker les informations d’authentification
 * - Appliquer les contraintes de validation (required, unique, lowercase, trim)
 *
 * Dépendances :
 * - mongoose
 *
 * Sécurité :
 * - Contrainte d’unicité sur l’email
 * - Normalisation automatique de l’email (lowercase, trim)
 *
 * Effets de bord :
 * - Persistance en base MongoDB via Mongoose
 */

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},
{
    timestamps: true
}
);

export default mongoose.model("User", UserSchema);