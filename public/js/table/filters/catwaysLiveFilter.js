/**
 * ===================================================================
 * CATWAYS LIVE FILTER
 * ===================================================================
 * - Filtrage en temps réel des catways :
 *   - Numéro
 *   - Type
 *   - État (ok / hs / warning)
 * - Met à jour le compteur
 * - Gère la ligne "aucun résultat"
 * - Notifie la table des changements de visibilité
 * ===================================================================
 */

export function initCatwaysLiveFilter() {
    const rows = Array.from(document.querySelectorAll(".js-catway-row"));

    const numberSelect = document.querySelector("#filter-catway");
    const typeSelect = document.querySelector("#filter-type");
    const stateOk = document.querySelector("#filter-state-ok");
    const stateHs = document.querySelector("#filter-state-hs");
    const stateWarn = document.querySelector("#filter-state-warning");
    const resetButton = document.querySelector("#filters-reset");
    const countLabel = document.querySelector("#catways-count");

    // Sécurité
    if (!numberSelect || !typeSelect || !stateOk || !stateHs || !stateWarn) return;

    const totalCount = rows.length;

    function updateCounter(visibleCount) {
        if (!countLabel) return;
        countLabel.textContent = `(${visibleCount} / ${totalCount})`;
    }

    function applyFilters() {
        const number = numberSelect.value;
        const type = typeSelect.value;

        const allowedStates = [];
        if (stateOk.checked) allowedStates.push("ok");
        if (stateHs.checked) allowedStates.push("hs");
        if (stateWarn.checked) allowedStates.push("warning");

        let visibleCount = 0;

        rows.forEach(row => {
            const rowNumber = row.dataset.number;
            const rowType   = row.dataset.type;
            const rowState  = (row.dataset.state || "").trim();

            let visible = true;

            // Numéro
            if (number && rowNumber !== number) {
                visible = false;
            }

            // Type
            if (visible && type && rowType !== type) {
                visible = false;
            }

            // État
            if (visible && allowedStates.length > 0 && !allowedStates.includes(rowState)) {
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

    // Events
    numberSelect.addEventListener("change", applyFilters);
    typeSelect.addEventListener("change", applyFilters);
    stateOk.addEventListener("change", applyFilters);
    stateHs.addEventListener("change", applyFilters);
    stateWarn.addEventListener("change", applyFilters);

    if (resetButton) {
        resetButton.addEventListener("click", resetFilters);
    }

    // Initialisation
    updateCounter(totalCount);
}