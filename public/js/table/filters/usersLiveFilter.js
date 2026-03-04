/**
 * USERS LIVE FILTER MODULE
 * =========================================================================================
 * @module usersLiveFilter
 *
 * Gère le filtrage dynamique côté client
 * pour la table des utilisateurs.
 *
 * Responsabilités :
 * - Filtrer par recherche texte (username / email)
 * - Mettre à jour la visibilité des lignes
 * - Maintenir le compteur visible / total
 * - Gérer l'affichage "aucun résultat"
 * - Émettre l'événement "table:visibility-change"
 */

import { normalizeString } from "../../utils/normalizeString.js";
import { handleNoResult } from "../noResultHandler.js";

/**
 * USERS LIVE FILTER INITIALISATION
 * =========================================================================================
 * Initialise le moteur de filtrage dynamique
 * pour la table des utilisateurs.
 *
 * @function initUsersLiveFilter
 * @returns {void}
 */

export function initUsersLiveFilter() {

    // ========================================================
    // DOM REFERENCES
    // ========================================================

    const rows = Array.from(document.querySelectorAll(".js-user-row"));

    const searchInput = document.querySelector("#filter-search");
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#users-count");

    function isFilterActive() {
        return searchInput.value.trim() !== "";
    }

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
        searchInput.value = "";

        rows.forEach(row => {
            row.hidden = false;
        });

        updateCounter(totalCount);
        handleNoResult("no-results-row", totalCount, false);

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
    handleNoResult("no-results-row", totalCount, isFilterActive);
}