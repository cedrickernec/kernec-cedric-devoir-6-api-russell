/**
 * ===================================================================
 * CATWAYS LIVE FILTER CONTROLLER
 * ===================================================================
 * - Filtre dynamiquement les lignes de la table Catways
 * - Applique plusieurs critères combinable :
 *      → Numéro
 *      → Type
 *      → État (OK / HS / WARNING)
 * - Met à jour le compteur de résultats visibles
 * - Gère l'affichage de la ligne "aucun résultat"
 * - Notifie tableCore des changements de visibilité
 * ===================================================================
 * Synchronisé avec tableCore via l'event "table:visibility-change"
 * ===================================================================
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
}