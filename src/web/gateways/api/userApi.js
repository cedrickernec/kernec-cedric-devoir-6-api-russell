/**
 * USER API GATEWAY
 * =========================================================================================
 * @module userApi
 *
 * Couche d’accès HTTP aux endpoints User.
 *
 * Responsabilités :
 * - Encapsuler les endpoints utilisateur
 * - Déléguer les appels à apiFetch
 * - Ne contenir aucune logique métier
 *
 * Effets de bord :
 * - Appels HTTP vers API interne
 */

import { apiFetch } from "./apiFetch.js";

/**
 * FETCH USERS
 * =========================================================================================
 * Récupère la liste des utilisateurs.
 *
 * @async
 * @function fetchUsers
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchUsers(req, res) {

    return apiFetch("/api/users", {
        method: "GET"
    }, req, res);
}

/**
 * FETCH USER BY ID
 * =========================================================================================
 * Récupère un utilisateur par identifiant.
 *
 * @async
 * @function fetchUserById
 *
 * @param {string} id - Identifiant utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchUserById(id, req, res) {

    return apiFetch(`/api/users/${id}`, {
        method: "GET"
    }, req, res);
}

/**
 * CREATE USER
 * =========================================================================================
 * Crée un utilisateur.
 *
 * @async
 * @function createUser
 *
 * @param {Object} data - Données utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function createUser(data, req, res) {

    return apiFetch(
        "/api/users", {
            method: "POST",
            body: JSON.stringify(data)
            }, req, res
    );
}

/**
 * UPDATE USER
 * =========================================================================================
 * Met à jour un utilisateur.
 *
 * @async
 * @function updateUser
 *
 * @param {string} id - Identifiant utilisateur
 * @param {Object} data - Nouvelles données de l'utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function updateUser(id, data, req, res) {

    return apiFetch(
        `/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }, req, res
    );
}

/**
 * UPDATE USER (PASSWORD)
 * =========================================================================================
 * Met à jour le mot de passe d'un utilisateur.
 *
 * @async
 * @function updatePassword
 *
 * @param {string} id - Identifiant de l'utilisateur
 * @param {Object} data - Nouveau mot de passe
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function updatePassword(id, data, req, res) {

    return apiFetch(
        `/api/users/${id}/password`, {
            method: "PUT",
            body: JSON.stringify(data)
        }, req, res
    );
}

/**
 * DELETE USER
 * =========================================================================================
 * Supprime un utilisateur.
 *
 * @async
 * @function deleteUser
 *
 * @param {string} id - Identifiant de l'utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function deleteUser(id, req, res) {

    return apiFetch(
        `/api/users/${id}`, {
            method: "DELETE",
        }, req, res
    );
}