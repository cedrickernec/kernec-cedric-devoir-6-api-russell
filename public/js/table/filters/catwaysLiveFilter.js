/**
 * CATWAYS LIVE FILTER MODULE
 * =========================================================================================
 * @module catwaysLiveFilter
 *
 * Implémente le filtrage dynamique côté client pour la table des catways.
 *
 * Responsabilités :
 * - Appliquer des filtres combinables (numéro, type, état)
 * - Mettre à jour la visibilité des lignes
 * - Maintenir un compteur visible / total
 * - Gérer l'affichage "aucun résultat"
 * - Notifier les autres modules via l'événement "table:visibility-change"
 *
 * Ce module agit uniquement au niveau UI (aucun appel réseau).
 */

import { handleNoResult } from "../noResultHandler.js";

/**
 * CATWAYS LIVE FILTER INITIALISATION
 * =========================================================================================
 * Initialise les filtres dynamiques et attache les listeners UI.
 *
 * @function initCatwaysLiveFilter
 * 
 * @returns {void}
 */

export function initCatwaysLiveFilter() {

    // ========================================================
    // DOM REFERENCES
    // ========================================================

    const rows = Array.from(document.querySelectorAll(".js-catway-row"));

    const numberSelect = document.querySelector("#filter-catway");
    const typeSelect = document.querySelector("#filter-type");
    const stateOk = document.querySelector("#filter-state-ok");
    const stateHs = document.querySelector("#filter-state-hs");
    const stateWarn = document.querySelector("#filter-state-warning");
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#catways-count");

    function isFilterActive() {
        return (
            numberSelect.value !== "" ||
            typeSelect.value !== "" ||
            stateOk.checked ||
            stateHs.checked ||
            stateWarn.checked
        )
    }

    // Sécurité : Si le filtre n'existe pas → abandon
    if (!numberSelect || !typeSelect || !stateOk || !stateHs || !stateWarn) return;

    const totalCount = rows.length;

    // ========================================================
    // COUNTER MANAGEMENT
    // ========================================================

    function updateCounter(visibleCount) {
        if (!countLabel) return;
        countLabel.textContent = `(${visibleCount} / ${totalCount})`;
    }

    // ========================================================
    // FILTER ENGINE
    // ========================================================

    function applyFilters() {
        const number = numberSelect.value;
        const type = typeSelect.value;

        // États autorisés sélectionnés
        const allowedStates = [];
        if (stateOk.checked) allowedStates.push("OK");
        if (stateHs.checked) allowedStates.push("HS");
        if (stateWarn.checked) allowedStates.push("WARNING");

        let visibleCount = 0;

        rows.forEach(row => {
            const rowNumber = row.dataset.catwayNumber;
            const rowType   = row.dataset.catwayType;
            const rowState  = (row.dataset.catwayState || "").trim();

            let visible = true;

            // ----- FILTER : NUMBER -----
            if (number && rowNumber !== number) {
                visible = false;
            }

            // ----- FILTER : TYPE -----
            if (visible && type && rowType !== type) {
                visible = false;
            }

            // ----- FILTER : STATE -----
            if (visible && allowedStates.length > 0 && !allowedStates.includes(rowState)) {
                visible = false;
            }

            row.hidden = !visible;
            if (visible) visibleCount++;
        });

        // Gestion ligne "aucun résultat"
        handleNoResult("no-results-row", visibleCount, isFilterActive);

        updateCounter(visibleCount);

        // Synchronisation avec tableCore (select-all / bulk delete)
        document.dispatchEvent(
            new CustomEvent("table:visibility-change")
        );
    }

    // ========================================================
    // RESET FILTERS
    // ========================================================

    function resetFilters() {
        numberSelect.value = "";
        typeSelect.value = "";
        stateOk.checked = false;
        stateHs.checked = false;
        stateWarn.checked = false;

        rows.forEach(row => {
            row.hidden = false;
        });

        const noResultRow = document.getElementById("no-results-row");
        if (noResultRow) {
            noResultRow.hidden = true;
        }

        updateCounter(totalCount);
        handleNoResult("no-results-row", totalCount, false);

        document.dispatchEvent(
            new CustomEvent("table:visibility-change")
        );
    }

    // ========================================================
    // EVENTS
    // ========================================================

    numberSelect.addEventListener("change", applyFilters);
    typeSelect.addEventListener("change", applyFilters);
    stateOk.addEventListener("change", applyFilters);
    stateHs.addEventListener("change", applyFilters);
    stateWarn.addEventListener("change", applyFilters);

    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }

    // Initialisation compteur
    updateCounter(totalCount);
    handleNoResult("no-results-row", totalCount, isFilterActive);
}