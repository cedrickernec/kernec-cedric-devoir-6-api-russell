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

export function computeCatwayStateKey({ catwayState, isOutOfService }) {

    if (isOutOfService) {
        return "HS";
    }

    if (catwayState === "bon état") {
        return "OK";
    }

    return "WARNING";
}