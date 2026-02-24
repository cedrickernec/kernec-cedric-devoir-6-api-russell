/**
 * ===================================================================
 * CATWAY STATE COMPUTATION
 * ===================================================================
 * - Détermine la clé d'état d'un catway
 * ===================================================================
 * Retourne une clé simplifiée utilisée par l'UI :
 *      - HS        → Hors service
 *      - OK        → Bon état
 *      - WARNING   → Nécessite une attention
 * ===================================================================
 */

/**
 * Calcule la clé d'état simplifiée d'un catway pour l'UI.
 *
 * Règles :
 * - HS       → Hors service
 * - OK       → Bon état
 * - WARNING  → Tout autre état
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