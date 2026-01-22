/**
 * ============================================================
 * CATWAY FORMATTER
 * ============================================================
 * - Formate les réponses retournées :
 *      - Nettoie les documents Mongo
 *      - Contrôle les champs exposés
 *      - Définit l'ordre des clés
 * ============================================================
 */

export function formatCatway(catway) {
    if (!catway) return null;

    const object = catway.toObject();

    return {
        id: object._id,
        number: object.catwayNumber,
        type: object.catwayType,
        state: object.catwayState,
        isOutOfService: object.isOutOfService,
        createdAt : object.createdAt,
        updatedAt : object.updatedAt
    };
}

export function formatCatwaysList(catways) {

    return catways.map(formatCatway);
}