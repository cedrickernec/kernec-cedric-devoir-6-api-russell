/**
 * ===================================================================
 * LOAD OTHER RESERVATIONS HELPER
 * ===================================================================
 * - Charge les réservations d'un catway
 * - Exclut la réservation actuellement affichée
 * - Transforme les données API en ViewModel list
 * ===================================================================
 * Utilisé principalement dans les pages détails
 * pour afficher les réservations associées.
 * ===================================================================
 */

import { fetchReservationsByCatway } from "../../gateways/api/reservationApi.js";
import { mapReservationToList } from "./reservationMapper.js";

/**
 * Charge les réservations associées à un catway,
 * en excluant la réservation courante.
 *
 * - Appelle le gateway API
 * - Vérifie la validité de la réponse
 * - Exclut currentId
 * - Transforme les données en ViewModel liste
 *
 * @async
 * @function loadOtherReservations
 *
 * @param {number|string} catwayNumber - Numéro du catway
 * @param {string} currentId - Identifiant à exclure
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<Object[]>} - Liste de réservations mappées
 */
export async function loadOtherReservations(catwayNumber, currentId, req, res) {

    // Appel API
    const apiAll = await fetchReservationsByCatway(catwayNumber, req, res);

    // Sécurité réponse API
    if (!apiAll?.success || !Array.isArray(apiAll.data)) {
        return [];
    }

    // Exclusion réservation courante
    return apiAll.data
    .filter(reservation => reservation.id !== currentId)
    .map(mapReservationToList);
}