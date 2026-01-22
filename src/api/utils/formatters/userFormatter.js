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

export function formatUser(user) {
    if (!user) return null;

    const object = user.toObject();

    return {
        id: object._id,
        username: object.username,
        email: object.email,
        createdAt: object.createdAt,
        updatedAt: object.updatedAt
    };
}

export function formatUsersList(users) {

    return users.map(formatUser);
}