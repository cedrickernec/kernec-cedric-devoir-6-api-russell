/**
 * ===================================================================
 * SELECTION STORE
 * ===================================================================
 * - Stockage centralisé des identifiants sélectionnés
 * ===================================================================
 */

export const selectedIds = new Set();

export function addSelection(id) {
  selectedIds.add(id);
}

export function removeSelection(id) {
  selectedIds.delete(id);
}

export function hasSelection(id) {
  return selectedIds.has(id);
}

export function clearSelections() {
  selectedIds.clear();
}

export function getSelections() {
  return selectedIds;
}

export function countSelectionsByCatway(catwayNumber) {
  return [...selectedIds].filter(id => id.startsWith(`${catwayNumber}|`)).length;
}