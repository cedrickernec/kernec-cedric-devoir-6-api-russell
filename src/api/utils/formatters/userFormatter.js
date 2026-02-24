/**
 * ============================================================
 * USER FORMATTER
 * ============================================================
 * - Formate les réponses retournées :
 *      - Nettoie les documents Mongo
 *      - Contrôle les champs exposés
 *      - Définit l'ordre des clés
 * ============================================================
 */

/**
 * Formate un utilisateur pour la réponse API.
 * Supprime les champs sensibles (ex: password).
 *
 * @function formatUser
 *
 * @param {Object} user - Document Mongo User
 *
 * @returns {Object|null}
 */
export function formatUser(user) {
    if (!user) return null;

    const object = user.toObject();

    return {
        id: object._id.toString(),
        username: object.username,
        email: object.email,
        createdAt: object.createdAt,
        updatedAt: object.updatedAt
    };
}

/**
 * Formate une liste d'utilisateurs.
 *
 * @function formatUsersList
 *
 * @param {Array<Object>} users
 *
 * @returns {Array<Object>}
 */
export function formatUsersList(users) {

    return users.map(formatUser);
}