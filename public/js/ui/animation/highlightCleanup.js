/**
 * ===================================================================
 * TEMPORARY CLEARING HIGHLIGHTING
 * ===================================================================
 * - Supprime l'attribut data-highlight après un délai
 * - (utilisé pour les animations de céation/mise à jour)
 * ===================================================================
 */

setTimeout(() => {
    document
    .querySelectorAll('tr[data-highlight="true"]')
    .forEach(tr => tr.removeAttribute('data-highlight'));
}, 3000)