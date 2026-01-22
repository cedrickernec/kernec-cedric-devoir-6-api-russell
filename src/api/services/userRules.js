/**
 * ============================================================
 * USER RULES
 * ============================================================
 * - Règles définies de ce qui est autorisé ou non
 * ============================================================
 */

// Peut-on supprimer son propre compte ?
export function canDeleteUser(currentUserId, targetUserId) {
    return currentUserId !== targetUserId;
}