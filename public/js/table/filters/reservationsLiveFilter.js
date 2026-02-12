/**
 * ===================================================================
 * RESERVATIONS LIVE FILTER
 * ===================================================================
 * - Filtrage par catway
 * - Recherche client / bateau
 * - Filtrage par période
 * - Filtrage par statut
 * - Met à jour le compteur
 * - Gère la ligne "aucun résultat"
 * ===================================================================
 */

import { normalizeString } from "../../utils/normalizeString.js";

export function initReservationsLiveFilter() {
    const rows = Array.from(document.querySelectorAll(".js-reservation-row"));

    // Champs potentiellement présent selon la page
    const catwaySelect = document.querySelector("#filter-catway");
    const searchInput = document.querySelector("#filter-search");
    const startInput = document.querySelector("#filter-start");
    const endInput = document.querySelector("#filter-end");
    const statusUpcoming = document.querySelector("#filter-status-upcoming")
    const statusInProgress = document.querySelector("#filter-status-in-progress")
    const statusFinished = document.querySelector("#filter-status-finished")
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#reservations-count");

    // Pas de champs de recherche → pas de filtre
    if (!searchInput && !startInput && !endInput) return;

    /* if (!catwaySelect || !searchInput || !startInput || !endInput) return; */

    const totalCount = rows.length;

    function updateCounter(visibleCount) {
        if (!countLabel) return;
        countLabel.textContent = `(${visibleCount} / ${totalCount})`;
    }

    function applyFilters() {
        const catway = catwaySelect ? catwaySelect.value : null;
        const search = searchInput ? normalizeString(searchInput.value.trim()) : "";

        const start = startInput ? startInput.value : null;
        const end = endInput ? endInput.value : null;

        const allowedStatus = [];
        if (statusUpcoming?.checked) allowedStatus.push("UPCOMING");
        if (statusInProgress?.checked) allowedStatus.push("IN_PROGRESS");
        if (statusFinished?.checked) allowedStatus.push("FINISHED");

        let visibleCount = 0;

        rows.forEach(row => {
            const rowCatway = row.dataset.catway;
            const client = normalizeString(row.dataset.client || "");
            const boat = normalizeString(row.dataset.boat || "");
            const rowStart = row.dataset.start;
            const rowEnd = row.dataset.end;
            const rowStatus = row.dataset.status;

            let visible = true;

            // Filtre catway (uniquement si le select existe)
            if (visible && catwaySelect && catway && rowCatway !== catway) {
                visible = false;
            }

            // Recherche texte
            if (
                visible &&
                search &&
                !client.includes(search) &&
                !boat.includes(search)
            ) {
                visible = false;
            }

            // Filtre dates
            if (visible && start && rowEnd < start) {
                visible = false;
            }

            if (visible && end && rowStart > end) {
                visible = false;
            }

            // Filtre status
            if ( visible && allowedStatus.length > 0 && !allowedStatus.includes(rowStatus)) {
                visible = false;
            }

            row.hidden = !visible;
            if (visible) visibleCount++;
        });

        const noResultRow = document.getElementById("no-results-row");
        if (noResultRow) {
            noResultRow.hidden = visibleCount !== 0;
        }

        updateCounter(visibleCount);

        document.dispatchEvent(
            new CustomEvent("table:visibility-change")
        );
    }

    function resetFilters() {
            if (catwaySelect) catwaySelect.value = "";
            if (searchInput) searchInput.value = "";
            if (startInput) startInput.value = "";
            if (endInput) endInput.value = "";
            if (statusUpcoming) statusUpcoming.checked = false;
            if (statusInProgress) statusInProgress.checked = false;
            if (statusFinished) statusFinished.checked = false;

            rows.forEach(row => {
            row.hidden = false;
        });

        const noResultRow = document.getElementById("no-results-row");
        if (noResultRow) {
            noResultRow.hidden = true;
        }

        updateCounter(totalCount);

        document.dispatchEvent(
            new CustomEvent("table:visibility-change")
        );
    }

    // Event seulement si les champs existent
     if (catwaySelect) catwaySelect.addEventListener("change", applyFilters);
     if (searchInput) searchInput.addEventListener("input", applyFilters);
     if (startInput) startInput.addEventListener("change", applyFilters);
     if (endInput) endInput.addEventListener("change", applyFilters);

     statusUpcoming?.addEventListener("change", applyFilters);
     statusInProgress?.addEventListener("change", applyFilters);
     statusFinished?.addEventListener("change", applyFilters);

    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }

    updateCounter(totalCount);
}