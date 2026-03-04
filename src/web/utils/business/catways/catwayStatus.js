/**
 * CATWAY STATUS BUILDER MODULE (WEB)
 * =========================================================================================
 * @module catwayStatus
 *
 * Construit l’état visuel d’un catway pour l’interface.
 *
 * Responsabilités :
 * - Déterminer le label affiché
 * - Associer la classe CSS correspondante
 * - Fournir le texte d’accessibilité (ARIA)
 *
 * Déclenché par :
 * - Mappers ou vues EJS
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */

/**
 * BUILD CATWAY STATUS
 * =========================================================================================
 * Construit les métadonnées UI d’un catway.
 *
 * @function buildCatwayStatus
 *
 * @param {Object} params
 * @param {string} params.catwayState
 * @param {boolean} params.isOutOfService
 *
 * @returns {Object}
 * @returns {string} returns.label
 * @returns {string} returns.className
 * @returns {string} returns.aria
 */

export function buildCatwayStatus({ catwayState, isOutOfService }) {

    if (isOutOfService) {
        return {
            label: catwayState,
            className: "status--danger",
            aria: "Catway hors service, non réservable",
        };
    }

    if (catwayState === "bon état") {
        return {
            label: catwayState,
            className: "status--ok",
            aria: "Catway en bon état",
        };
    } 

    return {
        label: catwayState,
        className: "status--warning",
        aria: "Catway réservable nécessitant une attention",
    };
}