

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