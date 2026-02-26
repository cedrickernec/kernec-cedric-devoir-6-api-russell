/**
 * HIGHLIGHT CLEANUP (POST-ANIMATION)
 * =========================================================================================
 * @module highlightCleanup
 * 
 * Supprime automatiquement l'attribut data-highlight="true"
 * après un délai afin de finaliser les animations visuelles.
 *
 * Utilisé pour :
 * - Mise en évidence post-création
 * - Mise en évidence post-mise à jour
 */

setTimeout(() => {
    document
    .querySelectorAll('tr[data-highlight="true"]')
    .forEach(tr => tr.removeAttribute('data-highlight'));
}, 3000)