/**
 * ===================================================================
 * USERS LIVE FILTER CONTROLLER
 * ===================================================================
 * - Filtre dynamiquement les lignes de la table Users
 * - Applique plusieurs critères combinable :
 *      → Nom d'utilisateur
 *      → Email
 * - Met à jour le compteur de résultats visibles
 * - Gère l'affichage de la ligne "aucun résultat"
 * - Notifie tableCore des changements de visibilité
 * ===================================================================
 * Synchronisé avec tableCore via l'event "table:visibility-change"
 * ===================================================================
 */

import { normalizeString } from "../../utils/normalizeString.js";

export function initUsersLiveFilter() {

    // ========================================================
    // DOM REFERENCES
    // ========================================================

    const rows = Array.from(document.querySelectorAll(".js-user-row"));

    const searchInput = document.querySelector("#filter-search");
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#users-count");

    // Sécurité : Si le filtre n'existe pas → abandon
    if (!searchInput) return;

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
        const search = normalizeString(searchInput.value.trim());
        let visibleCount = 0;

        rows.forEach(row => {
            const username = normalizeString(row.dataset.user);
            const email = normalizeString(row.dataset.email);

            // ----- FILTER : TEXT SEARCH -----
            const visible =
            !search ||
            username.includes(search) ||
            email.includes(search);

            row.hidden = !visible;

            if (visible) visibleCount++;
        });

        // Gestion ligne "aucun résultat"
        const noResultRow = document.getElementById("no-results-row");
        if (noResultRow) {
            noResultRow.hidden = visibleCount !== 0;
        }

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
        searchInput.value = "";

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

    // ========================================================
    // EVENTS
    // ========================================================

    searchInput.addEventListener("input", applyFilters);

    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }

    // Initialisation compteur
    updateCounter(totalCount);
}