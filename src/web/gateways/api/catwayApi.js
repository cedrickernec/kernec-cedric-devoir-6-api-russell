/**
 * CATWAY API GATEWAY
 * =========================================================================================
 * @module catwayApi
 *
 * Couche d’accès HTTP aux endpoints Catway.
 *
 * Responsabilités :
 * - Encapsuler les endpoints Catway
 * - Déléguer les appels à apiFetch
 * - Ne contenir aucune logique métier
 *
 * Dépendances :
 * - apiFetch
 *
 * Effets de bord :
 * - Appels HTTP vers l’API interne
 */

import { apiFetch } from "./apiFetch.js";

/**
 * FETCH CATWAYS
 * =========================================================================================
 * Récupère la liste des catways.
 *
 * @async
 * @function fetchCatways
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchCatways(req, res) {

    return apiFetch("/api/catways", {
        method: "GET"
    }, req, res);
}

/**
 * FETCH CATWAY BY NUMBER
 * =========================================================================================
 * Récupère un catway par numéro.
 *
 * @async
 * @function fetchCatwayByNumber
 *
 * @param {number} number - Numéro du catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchCatwayByNumber(number, req, res) {

    return apiFetch(`/api/catways/${number}`, {
        method: "GET"
    }, req, res);
}

/**
 * FETCH NEXT CATWAY NUMBER
 * =========================================================================================
 * Récupère le prochain numéro de catway disponible.
 *
 * - Utilisé pour suggérer un numéro lors de la création
 *
 * @async
 * @function fetchNextCatwayNumber
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchNextCatwayNumber(req, res) {

    return apiFetch("/api/catways/next-number", {
        method: "GET"
    }, req, res);
}

/**
 * CHECK CATWAY NUMBER
 * =========================================================================================
 * Vérifie la disponibilité d'un numéro de catway.
 *
 * @async
 * @function checkCatwayNumber
 *
 * @param {Object} payload
 * @param {number|string} payload.number
 * @param {string} [payload.excludeId]
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function checkCatwayNumber(payload, req, res) {

    return apiFetch(`/api/catways/check-number?number=${payload.number}&excludeId=${payload.excludeId || ""}`, {
        method: "GET"
    }, req, res);
}

/**
 * CREATE CATWAY
 * =========================================================================================
 * Crée un catway.
 *
 * @async
 * @function createCatway
 *
 * @param {Object} data - Données du catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function createCatway(data, req, res) {

    return apiFetch(
        "/api/catways", {
            method: "POST",
            body: JSON.stringify(data)
            }, req, res
    );
}

/**
 * UPDATE CATWAY
 * =========================================================================================
 * Met à jour un catway.
 *
 * @async
 * @function updateCatway
 *
 * @param {number} number - Numéro du catway
 * @param {Object} data - Données à modifier
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function updateCatway(number, data, req, res) {

    return apiFetch(
        `/api/catways/${number}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }, req, res
    );
}

/**
 * CHECK BULK CATWAY DELETE
 * =========================================================================================
 * Vérifie si une suppression multiple de catways est autorisée.
 *
 * - Utilisé avant une suppression multiple côté UI (pré-check)
 *
 * @async
 * @function checkBulkCatwayDelete
 *
 * @param {Object} payload - Données de vérification bulk
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function checkBulkCatwayDelete(payload, req, res) {
    return apiFetch(
        "/api/catways/bulk-check",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * DELETE BULK CATWAYS
 * =========================================================================================
 * Supprime plusieurs catways en une seule opération.
 *
 * - Utilisé pour la suppression multiple depuis la table (AJAX)
 *
 * @async
 * @function deleteBulkCatways
 *
 * @param {Object} payload - Données de suppression bulk
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function deleteBulkCatways(payload, req, res) {
    return apiFetch(
        "/api/catways/bulk",
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * DELETE CATWAY
 * =========================================================================================
 * Supprime un catway.
 *
 * @async
 * @function deleteCatway
 *
 * @param {number} number - Numéro du catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {string|null} [password=null] - Mot de passe de confirmation
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */
export async function deleteCatway(number, req, res, password = null) {

    const options = { method: "DELETE" };

    if (password) {
        options.body = JSON.stringify({ password });
    }

    return apiFetch(
        `/api/catways/${number}`,
        options,
        req,
        res
    );
}