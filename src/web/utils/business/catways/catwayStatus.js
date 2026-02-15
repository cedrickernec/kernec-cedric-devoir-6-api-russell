/**
 * ===================================================================
 * CATWAY STATUS BUILDER
 * ===================================================================
 * - Construit l'état visuel d'un catway pour l'interface utilisateur
 * - Associe :
 *      → label affiché
 *      → class CSS
 *      → texte d'accesibilité (ARIA)
 * ===================================================================
 * Centralise toute la logique d'état UI des catways.
 * ===================================================================
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