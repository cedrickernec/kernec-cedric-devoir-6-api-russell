/**
 * LOAD OTHER RESERVATIONS HELPER
 * =========================================================================================
 * @module loadOtherReservations
 *
 * Charge les réservations d’un catway pour affichage en page détail.
 *
 * Responsabilités :
 * - Appeler le gateway API
 * - Filtrer la réservation courante
 * - Transformer les données en ViewModel
 *
 * Dépendances :
 * - fetchReservationsByCatway
 * - mapReservationToList
 *
 * Effets de bord :
 * - Appel réseau via gateway
 */

import { fetchReservationsByCatway } from "../../gateways/api/reservationApi.js";
import { mapReservationToList } from "./reservationMapper.js";

/**
 * LOAD OTHER RESERVATIONS
 * =========================================================================================
 * Charge les réservations associées à un catway,
 * en excluant la réservation courante.
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