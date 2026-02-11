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
import { computeCatwayStateKey } from "../catways/catwayState.js";

export function formatCatway(catway) {
    if (!catway) return null;

    const object = catway.toObject();

    return {
        id: object._id,
        catwayNumber: object.catwayNumber,
        catwayType: object.catwayType,
        catwayState: object.catwayState,
        isOutOfService: object.isOutOfService,
        stateKey: computeCatwayStateKey({
            catwayState: catway.catwayState,
            isOutOfService: catway.isOutOfService
        }),
        createdAt : object.createdAt,
        updatedAt : object.updatedAt
    };
}

export function formatCatwaysList(catways) {

    return catways.map(formatCatway);
}