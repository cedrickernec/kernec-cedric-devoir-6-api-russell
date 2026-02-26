/**
 * NO RESULT HANDLER MODULE
 * =========================================================================================
 * @module noResultHandler
 *
 * Gère l'affichage conditionnel de la ligne "aucun résultat"
 * dans une table HTML.
 *
 * Comportement :
 * - Affiche la ligne si aucune donnée visible
 * - Choisit le message selon l'état des filtres
 * - Masque la ligne si des éléments sont visibles
 *
 * Ce module est volontairement générique et réutilisable.
 */

/**
 * HANDLE NO RESULT
 * =========================================================================================
 * Met à jour l'état d'affichage de la ligne "aucun résultat".
 *
 * @function handleNoResult
 * 
 * @param {string} rowId
 * @param {number} visibleCount
 * @param {Function} isFilterActive
 * 
 * @returns {void}
 */

export function handleNoResult(rowId, visibleCount, isFilterActive) {

    const row = document.getElementById(rowId);
    const cell = row?.querySelector("td");

    if (!row || !cell) return;

    if (visibleCount === 0) {
        row.hidden = false;

        const message = isFilterActive()
            ? row.dataset.filter
            : row.dataset.empty;

        cell.textContent = message;

    } else {
        row.hidden = true;
    }
}