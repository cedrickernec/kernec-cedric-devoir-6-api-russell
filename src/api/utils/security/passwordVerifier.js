/**
 * PASSWORD VERIFICATION
 * =========================================================================================
 * @module passwordVerifier
 *
 * Vérifie le mot de passe d’un utilisateur via bcrypt.
 *
 * Usage :
 * - Confirmation d’actions sensibles (suppression avec réservations, etc.)
 *
 * Dépendances :
 * - bcrypt
 * - User model (Mongo)
 *
 * Comportement :
 * - Si user introuvable → false
 * - Sinon compare plainPassword au hash stocké → boolean
 */

import bcrypt from "bcrypt";
import User from "../../models/User.js";

/**
 * VERIFY USER PASSWORD
 * =========================================================================================
 * Vérifie le mot de passe d’un utilisateur.
 *
 * @function verifyUserPassword
 *
 * @param {string} userId ObjectId utilisateur
 * @param {string} plainPassword Mot de passe en clair
 *
 * @returns {Promise<boolean>}
 */

export const verifyUserPassword = async (userId, plainPassword) => {

    const user = await User.findById(userId);
    if (!user) return false;

    return bcrypt.compare(plainPassword, user.password);
};