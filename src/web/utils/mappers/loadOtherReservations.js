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