/**
 * CATWAY STATE COMPUTATION
 * =========================================================================================
 * @module catwayState
 *
 * Détermine une clé d’état simplifiée destinée à l’UI.
 *
 * Règles :
 * - HS       : catway hors service
 * - OK       : état "bon état"
 * - WARNING  : tout autre état
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */


/**
 * COMPUTE CATWAY STATE KEY
 * =========================================================================================
 * Calcule la clé d’état simplifiée d’un catway pour l’UI.
 *
 * @function computeCatwayStateKey
 *
 * @param {Object} options
 * @param {string} options.catwayState
 * @param {boolean} options.isOutOfService
 *
 * @returns {"HS"|"OK"|"WARNING"}
 */

export function computeCatwayStateKey({ catwayState, isOutOfService }) {

    if (isOutOfService) {
        return "HS";
    }

    if (catwayState === "bon état") {
        return "OK";
    }

    return "WARNING";
}