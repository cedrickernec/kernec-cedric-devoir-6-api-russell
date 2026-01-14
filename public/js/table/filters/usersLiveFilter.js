/**
 * ===================================================================
 * USERS LIVE FILTER
 * ===================================================================
 * - Filtrage en temps réel des utilisateurs :
 *   - Recherche sur username / email
 * - Met à jour le compteur
 * - Gère la ligne "aucun résultat"
 * - Notifie la table des changements de visibilité
 * ===================================================================
 */

export function initUsersLiveFilter() {
    const rows = Array.from(document.querySelectorAll(".js-user-row"));

    const searchInput = document.querySelector("#filter-search");
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#users-count");

    // Sécurité
    if (!searchInput) return;

    const totalCount = rows.length;

    function updateCounter(visibleCount) {
        if (!countLabel) return;

        countLabel.textContent = `(${visibleCount} / ${totalCount})`;
    }

    function applyFilters() {
        const search = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        rows.forEach(row => {
            const username = row.dataset.user || "";
            const email = row.dataset.email || "";

            const visible =
            !search ||
            username.includes(search) ||
            email.includes(search);

            row.hidden = !visible;

            if (visible) visibleCount++;
        });

        const noResultRow = document.getElementById("no-results-row");
        if (noResultRow) {
            noResultRow.hidden = visibleCount !== 0;
        }

        updateCounter(visibleCount);

        // Notification pour bulkTable / select-all
        document.dispatchEvent(
            new CustomEvent("table:visibility-change")
        );
    }

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

    // Events
    searchInput.addEventListener("input", applyFilters);

    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }

    // Initialisation compteur
    updateCounter(totalCount);
}