/**
 * ===================================================================
 * RESERVATIONS LIVE FILTER
 * ===================================================================
 * - Filtrage par catway
 * - Recherche client / bateau
 * - Filtrage par période
 * - Met à jour le compteur
 * - Gère la ligne "aucun résultat"
 * ===================================================================
 */

export function initReservationsLiveFilter() {
    const rows = Array.from(document.querySelectorAll(".js-reservation-row"));

    const catwaySelect = document.querySelector("#filter-catway");
    const searchInput = document.querySelector("#filter-search");
    const startInput = document.querySelector("#filter-start");
    const endInput = document.querySelector("#filter-end");
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#reservations-count");

    if (!catwaySelect || !searchInput || !startInput || !endInput) return;

    const totalCount = rows.length;

    function updateCounter(visibleCount) {
        if (!countLabel) return;
        countLabel.textContent = `(${visibleCount} / ${totalCount})`;
    }

    function applyFilters() {
        const catway = catwaySelect.value;
        const search = searchInput.value.trim().toLowerCase();
        const start = startInput.value;
        const end = endInput.value;

        let visibleCount = 0;

        rows.forEach(row => {
            const rowCatway = row.dataset.catway;
            const client = row.dataset.client || "";
            const boat = row.dataset.boat || "";
            const rowStart = row.dataset.start;
            const rowEnd = row.dataset.end;

            let visible = true;

            if (catway && rowCatway !== catway) {
                visible = false;
            }

            if (
                visible &&
                search &&
                !client.includes(search) &&
                !boat.includes(search)
            ) {
                visible = false;
            }

            if (visible && start && rowEnd < start) {
                visible = false;
            }

            if (visible && end && rowStart > end) {
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
            catwaySelect.value = "";
            searchInput.value = "";
            startInput.value = "";
            endInput.value = "";

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

    catwaySelect.addEventListener("change", applyFilters);
    searchInput.addEventListener("input", applyFilters);
    startInput.addEventListener("change", applyFilters);
    endInput.addEventListener("change", applyFilters);

    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }

    updateCounter(totalCount);
}