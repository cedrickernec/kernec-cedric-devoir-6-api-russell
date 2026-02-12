/**
 * ===================================================================
 * GET AVAILABLE CATWAY
 * ===================================================================
 * - Sélection des catways compatible pour une réservation
 * ===================================================================
 */

import { getCatwayCompatibility } from "./reservationAvailability.js";

const BLOKED_STATES = [
    "réparation",
    "indisponible",
    "ne peut être réservé",
    "hors service"
];

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