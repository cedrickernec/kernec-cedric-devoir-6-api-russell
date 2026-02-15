/**
 * ===================================================================
 * USER MODEL
 * ===================================================================
 * - Représente un utilisateur de l'application
 * - Stocke les informations d'authentification
 * ===================================================================
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