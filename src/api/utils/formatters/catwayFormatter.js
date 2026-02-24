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

/**
 * Formate un document Catway pour la réponse API.
 * Supprime les champs sensibles et ajoute la clé d'état simplifiée.
 *
 * @function formatCatway
 *
 * @param {Object} catway - Document Mongo Catway
 *
 * @returns {Object|null}
 */
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

/**
 * Formate une liste de catways.
 *
 * @function formatCatwaysList
 *
 * @param {Array<Object>} catways
 *
 * @returns {Array<Object>}
 */
export function formatCatwaysList(catways) {

    return catways.map(formatCatway);
}