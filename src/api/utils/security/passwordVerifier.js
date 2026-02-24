/**
 * ===================================================================
 * PASSWORD VERIFICATION SERVICE
 * ===================================================================
 * - Vérifie un mot de passe utilisateur via bcrypt
 * ===================================================================
 * Utiliser pour les actions sensibles nécessitant confirmation
 * ===================================================================
 */

import bcrypt from "bcrypt";
import User from "../../models/User.js";

/**
 * Vérifie le mot de passe d'un utilisateur.
 *
 * Utilisé pour confirmer des actions sensibles
 * (suppression avec réservations, etc.).
 *
 * @function verifyUserPassword
 *
 * @param {string} userId - ObjectId utilisateur
 * @param {string} plainPassword - Mot de passe en clair
 *
 * @returns {Promise<boolean>}
 */
export const verifyUserPassword = async (userId, plainPassword) => {

    const user = await User.findById(userId);
    if (!user) return false;

    return bcrypt.compare(plainPassword, user.password);
};