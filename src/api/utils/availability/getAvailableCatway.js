/**
 * GET AVAILABLE CATWAY
 * =========================================================================================
 * @module getAvailableCatway
 *
 * Sélectionne les catways compatibles avec une demande de réservation sur une période.
 *
 * Fonctionnalités :
 * - Calcule la compatibilité d’un catway sur une période (via getCatwayCompatibility)
 * - Filtre par numéro (optionnel) et par type (optionnel)
 * - Exclut les catways dont l’état interdit la réservation (mots-clés bloquants)
 * - Supporte les disponibilités partielles (allowPartial)
 *
 * Dépendances :
 * - reservationAvailability.getCatwayCompatibility
 *
 * Format attendu :
 * - options.catways : Array d’objets catway (catwayNumber, catwayType, catwayState…)
 * - options.reservations : Array de réservations existantes (catwayNumber, startDate, endDate…)
 * - startDate/endDate : Date (déjà parsées/normalisées en amont)
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */

import { getCatwayCompatibility } from "./reservationAvailability.js";

const BLOKED_STATES = [
    "réparation",
    "indisponible",
    "ne peut être réservé",
    "hors service"
];



/**
 * GET AVAILABLE CATWAYS
 * =========================================================================================
 * Filtre et retourne les catways compatibles avec une période donnée.
 *
 * @function getAvailableCatways
 *
 * @param {Object} options
 * @param {Array<Object>} options.catways Liste des catways
 * @param {Array<Object>} options.reservations Réservations existantes
 * @param {Date} options.startDate Date de début recherchée
 * @param {Date} options.endDate Date de fin recherchée
 * @param {boolean} [options.allowPartial=false] Autorise les disponibilités partielles
 * @param {string|null} [options.selectedType=null] Filtre type (short/long)
 * @param {number|null} [options.selectedCatwayNumber=null] Filtre sur numéro précis
 *
 * @returns {Array<{catway: Object, compatibility: Object}>}
 */

export function getAvailableCatways({
    catways,
    reservations,
    startDate,
    endDate,
    allowPartial = false,
    selectedType = null,
    selectedCatwayNumber = null
}) {
    return catways

    .map(catway => {
        const compatibility = getCatwayCompatibility({
            catwayNumber: catway.catwayNumber,
            reservations,
            startDate,
            endDate
        });

        return {
            catway,
            compatibility
        };
    })

    .filter(({ catway, compatibility }) => {

        // Filtre par catwayNumber
        if (selectedCatwayNumber !== null && Number(catway.catwayNumber) !== Number(selectedCatwayNumber)) {
            return false
        }

        // Exclusion des catways non réservables par état
        const state = catway.catwayState.toLowerCase()
        const isBlocked = BLOKED_STATES.some(keyword => state.includes(keyword));

        if (isBlocked) {
            return false;
        }

        // Filtre par type (short/long)
        if (selectedType && catway.catwayType !== selectedType) {
            return false;
        }

        // Compatibilité des dates
        if (compatibility.status === "full") return true;
        if (allowPartial && compatibility.status === "partial") return true;

        return false;
    });
}