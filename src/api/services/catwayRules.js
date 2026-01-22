/**
 * ============================================================
 * CATWAY RULES
 * ============================================================
 * - Règles définies de ce qui est autorisé ou non
 * ============================================================
 */

// Peut-on modifier le numéro de catway ?
export function canUpdateCatwayNumber(data) {
    return data.catwayNumber === undefined;
}

// Peut-on modifier le type du catway ?
export function canUpdateCatwayType(data) {
    return data.catwayType === undefined;
}

// Peut-on supprimer un catway ?
export function canDeleteCatway(hasReservations) {
    return !hasReservations;
}