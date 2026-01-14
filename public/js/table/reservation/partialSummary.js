/**
 * ===================================================================
 * PARTIAL SUMMARY
 * ===================================================================
 * - Met à jour les cellules de résumé des créneaux partiels
 * - Synchronisé avec le store de sélection
 * ===================================================================
 */

import { countSelectionsByCatway } from "../core/selectionStore.js";

export function updatePartialSummary(catwayNumber) {
  const summaryCell = document.querySelector(
    `[data-partial-summary="${catwayNumber}"]`
  );
  if (!summaryCell) return;

  const total = Number(summaryCell.dataset.totalSlots);
  const selectedCount = countSelectionsByCatway(catwayNumber);

  if (selectedCount === 0) {
    summaryCell.textContent =
      `${total} créneau${total > 1 ? "x" : ""} disponible${total > 1 ? "s" : ""}`;
    summaryCell.classList.add("muted");
    summaryCell.classList.remove("bold");
  } else {
    summaryCell.textContent =
      `${selectedCount} créneau${selectedCount > 1 ? "x" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`;
    summaryCell.classList.remove("muted");
    summaryCell.classList.add("bold");
  }
}

export function refreshAllPartialSummaries() {
  document.querySelectorAll("[data-partial-summary]").forEach(cell => {
    updatePartialSummary(cell.dataset.partialSummary);
  });
}