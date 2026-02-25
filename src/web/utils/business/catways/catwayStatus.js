/**
 * ===================================================================
 * CATWAY STATUS BUILDER
 * ===================================================================
 * Construit l'état visuel d'un catway pour l'interface.
 *
 * - Associe label affiché
 * - Définit la classe CSS correspondante
 * - Fournit le texte d’accessibilité (ARIA)
 *
 * @function buildCatwayStatus
 *
 * @param {Object} params
 * @param {string} params.catwayState - État textuel du catway
 * @param {boolean} params.isOutOfService - Indique si le catway est hors service
 *
 * @returns {Object} - Métadonnées UI
 * @returns {string} - returns.label
 * @returns {string} - returns.className
 * @returns {string} - returns.aria
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