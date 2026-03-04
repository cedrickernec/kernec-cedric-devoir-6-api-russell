/**
 * CATWAY FORMATTER
 * =========================================================================================
 * @module catwayFormatter
 *
 * Formate les documents Catway pour les réponses API.
 *
 * Objectifs :
 * - Contrôler les champs exposés (API output contract)
 * - Normaliser l’ordre des clés
 * - Ajouter des champs dérivés utiles (ex: stateKey)
 *
 * Dépendances :
 * - computeCatwayStateKey (mapping d’état pour l’UI)
 */

import { computeCatwayStateKey } from "../catways/catwayState.js";

/**
 * FORMAT CATWAY
 * =========================================================================================
 * Transforme un document Catway en objet JSON API.
 *
 * @function formatCatway
 *
 * @param {Object} catway Document Mongo Catway
 *
 * @returns {Object|null} Catway formaté ou null si entrée vide
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
 * FORMAT CATWAYS LIST
 * =========================================================================================
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