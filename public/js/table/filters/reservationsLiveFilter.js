/**
 * ===================================================================
 * RESERVATIONS LIVE FILTER CONTROLLER
 * ===================================================================
 * - Filtre dynamiquement les lignes de la table Reservations
 * - Applique plusieurs critères combinable :
 *      → Numéro de catway
 *      → Recherche client / bateau
 *      → Période (dates)
 *      → Statut de la réservation (UPCOMING / IN_PROGRESS / FINISHED)
 * - Met à jour le compteur de résultats visibles
 * - Gère l'affichage de la ligne "aucun résultat"
 * - Notifie tableCore des changements de visibilité
 * ===================================================================
 * → Synchronisé avec tableCore via l'event "table:visibility-change"
 * ===================================================================
 */

import { normalizeString } from "../../utils/normalizeString.js";
import { handleNoResult } from "../noResultHandler.js";

export function initReservationsLiveFilter() {

    // ========================================================
    // DOM REFERENCES
    // ========================================================

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

    function isFilterActive() {
        return (
            (searchInput && searchInput.value.trim() !== "") ||
            (startInput && startInput.value !== "") ||
            (endInput && endInput.value !== "") ||
            (statusUpcoming?.checked) ||
            (statusInProgress?.checked) ||
            (statusFinished?.checked)
        );
    }

    // Sécurité : Si le filtre n'existe pas → abandon
    if (!searchInput && !startInput && !endInput) return;

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
        const catway = catwaySelect ? catwaySelect.value : null;
        const search = searchInput ? normalizeString(searchInput.value.trim()) : "";

        const start = startInput ? startInput.value : null;
        const end = endInput ? endInput.value : null;

        // Statuts autorisés sélectionnés
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

            // ----- FILTER : CATWAYNUMBER ----- (uniquement si le select existe)
            if (visible && catwaySelect && catway && rowCatway !== catway) {
                visible = false;
            }

            // ----- FILTER : TEXT SEARCH -----
            if (
                visible &&
                search &&
                !client.includes(search) &&
                !boat.includes(search)
            ) {
                visible = false;
            }

            // ----- FILTER : DATE RANGE -----
            if (visible && start && rowEnd < start) {
                visible = false;
            }

            if (visible && end && rowStart > end) {
                visible = false;
            }

            // ----- FILTER : STATUS -----
            if ( visible && allowedStatus.length > 0 && !allowedStatus.includes(rowStatus)) {
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
        handleNoResult("no-results-row", totalCount, false);

        document.dispatchEvent(
            new CustomEvent("table:visibility-change")
        );
    }

    // ========================================================
    // EVENTS
    // ========================================================

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

    // Initialisation compteur
    updateCounter(totalCount);
    handleNoResult("no-results-row", totalCount, isFilterActive);
}