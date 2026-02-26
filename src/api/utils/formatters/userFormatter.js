/**
 * USER FORMATTER
 * =========================================================================================
 * @module userFormatter
 *
 * Formate les utilisateurs pour les réponses API.
 *
 * Objectifs :
 * - Contrôler les champs exposés (jamais de password)
 * - Normaliser l’ordre des clés
 */

/**
 * FORMAT USER
 * =========================================================================================
 * Transforme un document User en objet JSON API.
 *
 * @function formatUser
 *
 * @param {Object} user Document Mongo User
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
 * FORMAT USERS LIST
 * =========================================================================================
 * Formate une liste d’utilisateurs.
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