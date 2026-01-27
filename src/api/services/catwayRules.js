/**
 * ============================================================
 * CATWAY RULES
 * ============================================================
 * - Règles définies de ce qui est autorisé ou non
 * ============================================================
 */

// Peut-on supprimer un catway ?
export function canDeleteCatway(hasReservations) {
    return !hasReservations;
}