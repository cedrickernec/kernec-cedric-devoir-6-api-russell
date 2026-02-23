/**
 * ===================================================================
 * NO RESULT HANDLER
 * ===================================================================
 * Middleware utilisé côté web pour gérer l'affichage lorsqu'un
 * résultat n'est pas présent dans un tableau.
 * 
 * - Permet d'afficher un message adapté :
 *      - Liste vide
 *      - Aucun résultat après filtrage
 * ===================================================================
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