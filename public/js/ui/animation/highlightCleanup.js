/**
 * ===================================================================
 * HIGHLIGHT CLEANUP (POST-ANIMATION)
 * ===================================================================
 * - Supprime l'attribut data-highlight après un délai
 * - Permet de déterminer proprement les animations visuelles
 * ===================================================================
 * Utilisé pour les animations de céation/mise à jour.
 * ===================================================================
 */

setTimeout(() => {
    document
    .querySelectorAll('tr[data-highlight="true"]')
    .forEach(tr => tr.removeAttribute('data-highlight'));
}, 3000)