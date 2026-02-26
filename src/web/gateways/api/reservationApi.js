/**
 * RESERVATION API GATEWAY
 * =========================================================================================
 * @module reservationApi
 *
 * Couche d’accès HTTP aux endpoints Reservation.
 *
 * Responsabilités :
 * - Encapsuler les endpoints Reservation
 * - Déléguer les appels à apiFetch
 * - Maintenir une séparation claire Web ↔ API
 *
 * Effets de bord :
 * - Appels HTTP internes
 */

import { apiFetch } from "./apiFetch.js";

/**
 * FETCH RESERVATIONS
 * =========================================================================================
 * Récupère la liste des réservations.
 *
 * @async
 * @function fetchReservations
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchReservations(req, res) {
    return apiFetch("/api/reservations", {
        method: "GET"
    }, req, res);
}

/**
 * FETCH RESERVATIONS BY CATWAY
 * =========================================================================================
 * Récupère les réservations d'un catway.
 *
 * @async
 * @function fetchReservationsByCatway
 *
 * @param {number|string} catwayNumber - Numéro du catway
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchReservationsByCatway(catwayNumber, req, res) {
    return apiFetch(`/api/catways/${catwayNumber}/reservations`, {
        method: "GET"
    }, req, res);
}

/**
 * FETCH RESERVATIONS BY ID
 * =========================================================================================
 * Récupère une réservation par identifiant.
 *
 * @async
 * @function fetchReservationById
 *
 * @param {number|string} catwayNumber - Numéro du catway
 * @param {string} reservationId - Identifiant réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchReservationById(catwayNumber, reservationId, req, res) {
    return apiFetch(
        `/api/catways/${catwayNumber}/reservations/${reservationId}`, {
            method: "GET"
        }, req, res
    );
}

/**
 * FETCH RESERVATION AVAILABILITY
 * =========================================================================================
 * Recherche la disponibilité des catways sur une période.
 *
 * - Envoie un payload contenant startDate/endDate et filtres éventuels
 *
 * @async
 * @function fetchReservationAvailability
 *
 * @param {Object} payload
 * @param {string} payload.startDate - Date de début (ISO)
 * @param {string} payload.endDate - Date de fin (ISO)
 * @param {string} [payload.catwayType] - Filtre type ("short"|"long"|"all")
 * @param {boolean} [payload.allowPartial] - Autorise les créneaux partiels
 * @param {number|string} [payload.catwayNumber] - Filtre numéro catway (optionnel)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function fetchReservationAvailability(payload, req, res) {
    return apiFetch(
        "/api/reservations/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * CREATE RESERVATION
 * =========================================================================================
 * Crée une réservation.
 *
 * @async
 * @function createReservation
 *
 * @param {number|string} catwayNumber
 * @param {Object} payload - Données de réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function createReservation(catwayNumber, payload, req, res) {
    return apiFetch(
        `/api/catways/${catwayNumber}/reservations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * UPDATE RESERVATION
 * =========================================================================================
 * Met à jour une réservation.
 *
 * @async
 * @function updateReservation
 *
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @param {Object} payload - Données à modifier
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function updateReservation(catwayNumber, reservationId, payload, req, res) {
    return apiFetch(
        `/api/catways/${catwayNumber}/reservations/${reservationId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * CHECK BULK RESERVATION DELETE
 * =========================================================================================
 * Vérifie si une suppression multiple de réservations est autorisée.
 *
 * - Utilisé avant une suppression multiple côté UI (pré-check)
 *
 * @async
 * @function checkBulkReservationDelete
 *
 * @param {Object} payload - Données de vérification bulk
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function checkBulkReservationDelete(payload, req, res) {
    return apiFetch(
        "/api/reservations/bulk-check",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * DELETE BULK RESERVATIONS
 * =========================================================================================
 * Supprime plusieurs réservations en une seule opération.
 *
 * - Utilisé pour la suppression multiple depuis la table (AJAX)
 *
 * @async
 * @function deleteBulkReservations
 *
 * @param {Object} payload - Données de suppression bulk
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function deleteBulkReservations(payload, req, res) {
    return apiFetch(
        "/api/reservations/bulk",
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

/**
 * DELETE RESERVATION
 * =========================================================================================
 * Supprime une réservation.
 *
 * @async
 * @function deleteReservation
 *
 * @param {number|string} catwayNumber
 * @param {string} reservationId
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {string|null} [password=null]
 *
 * @returns {Promise<ApiFetchResult>} - Résultat normalisé de apiFetch
 */

export async function deleteReservation(catwayNumber, reservationId, req, res, password = null) {

    const options = { method: "DELETE" };

    if (password) {
        options.body = JSON.stringify({ password });
    }

    return apiFetch(
        `/api/catways/${catwayNumber}/reservations/${reservationId}`,
        options,
        req,
        res
    );
}