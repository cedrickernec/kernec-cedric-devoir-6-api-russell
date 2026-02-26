/**
 * USER RULES
 * =========================================================================================
 * @module userRules
 *
 * Centralise les règles métier “pures” liées aux utilisateurs.
 *
 * Fonctionnalités :
 * - Interdire l’auto-suppression (règle de protection)
 */

/**
 * CAN DELETE USER
 * =========================================================================================
 * Détermine si un utilisateur peut supprimer un autre utilisateur.
 *
 * @function canDeleteUser
 *
 * @param {string} currentUserId
 * @param {string} targetUserId
 *
 * @returns {boolean}
 */

export function canDeleteUser(currentUserId, targetUserId) {
    return currentUserId !== targetUserId;
}