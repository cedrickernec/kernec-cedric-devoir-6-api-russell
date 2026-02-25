/**
 * ===================================================================
 * USER REPOSITORY
 * ===================================================================
 * - Lit et écrit les données uniquement :
 *      - Centralise tous les accès à la base de données
 * ===================================================================
 */

import User from "../models/User.js";

// ===============================================
// GET ALL USERS
// ===============================================
/**
 * Récupère tous les utilisateurs.
 *
 * - Trie par username (ordre alphabétique)
 * - Exclut le champ password
 *
 * @async
 * @function getAllUsers
 *
 * @returns {Promise<Object[]>}
 */
export async function getAllUsers() {

    return User.find()
    .collation({ locale: "fr", strength: 2 })
    .sort({ username: 1 })
    .select("-password");
}

// ===============================================
// FIND USER BY ID
// ===============================================
/**
 * Recherche un utilisateur par identifiant.
 *
 * - Exclut le champ password
 *
 * @async
 * @function findUserById
 *
 * @param {string} id
 *
 * @returns {Promise<Object|null>}
 */
export async function findUserById(id) {

    return User.findById(id).select("-password");
}

// ===============================================
// FIND USER BY ID (WITH PASSWORD)
// - For updatePassword
// ===============================================
/**
 * Recherche un utilisateur par identifiant
 * en incluant le mot de passe.
 *
 * @async
 * @function findUserByIdWithPassword
 *
 * @param {string} id
 *
 * @returns {Promise<Object|null>}
 */
export async function findUserByIdWithPassword(id) {

    return User.findById(id);
}

// ===============================================
// FIND USER BY EMAIL
// ===============================================
/**
 * Recherche un utilisateur par email.
 *
 * - Exclut le champ password
 *
 * @async
 * @function findUserByEmail
 *
 * @param {string} email
 *
 * @returns {Promise<Object|null>}
 */
export async function findUserByEmail(email) {

    return User.findOne({ email }).select("-password");
}

// ===============================================
// FIND USER BY EMAIL (WITH PASSWORD)
// - For login
// ===============================================
/**
 * Recherche un utilisateur par email
 * en incluant le mot de passe.
 *
 * @async
 * @function findUserByEmailWithPassword
 *
 * @param {string} email
 *
 * @returns {Promise<Object|null>}
 */
export async function findUserByEmailWithPassword(email) {

    return User.findOne({ email });
}

// ===============================================
// CREATE USER
// ===============================================
/**
 * Crée un nouvel utilisateur.
 *
 * @async
 * @function createUser
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>}
 */
export async function createUser(data) {

    return User.create(data);
}

// ===============================================
// UPDATE USER
// ===============================================
/**
 * Met à jour un utilisateur par identifiant.
 *
 * - Retourne la version mise à jour
 * - Exclut le champ password
 *
 * @async
 * @function updateUserById
 *
 * @param {string} id
 * @param {Object} data
 *
 * @returns {Promise<Object|null>}
 */
export async function updateUserById(id, data) {

    return User.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    ).select("-password");
}

// ===============================================
// DELETE USER
// ===============================================
/**
 * Supprime un utilisateur par identifiant.
 *
 * @async
 * @function deleteUserById
 *
 * @param {string} id
 *
 * @returns {Promise<Object|null>}
 */
export async function deleteUserById(id) {

    return User.findByIdAndDelete(id).select("-password");
}
