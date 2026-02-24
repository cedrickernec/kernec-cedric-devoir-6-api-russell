/**
 * ============================================================
 * USER RULES
 * ============================================================
 * - Règles définies de ce qui est autorisé ou non
 * ============================================================
 */

/**
 * Détermine si un utilisateur peut supprimer un autre utilisateur.
 *
 * @function canDeleteUser
 *
 * @param {string} currentUserId - ID de l'utilisateur connecté
 * @param {string} targetUserId - ID de l'utilisateur cible
 *
 * @returns {boolean} - true si la suppression est autorisée
 */
export function canDeleteUser(currentUserId, targetUserId) {
    return currentUserId !== targetUserId;
}