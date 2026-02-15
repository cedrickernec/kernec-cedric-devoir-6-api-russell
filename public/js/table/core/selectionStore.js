/**
 * ===================================================================
 * GLOBAL SELECTION STORE
 * ===================================================================
 * - Stockage centralisé des identifiants sélectionnés
 * - Partagé entre plusieurs composants UI
 * - Permet une synchronisation indépendante du DOM
 * ===================================================================
 * Concept :
 * → La selection vit dans la mémoire applicative
 * ===================================================================
 */

export const selectedIds = new Set();

// ========================================================
// MUTATIONS
// ========================================================

// Ajoute un élément de la sélection globale
export function addSelection(id) {
  selectedIds.add(id);
}

// Retire un élément de la sélection globale
export function removeSelection(id) {
  selectedIds.delete(id);
}

// Vérifie si un élément est sélectionné
export function hasSelection(id) {
  return selectedIds.has(id);
}

// Vide complètement la sélection
export function clearSelections() {
  selectedIds.clear();
}

// ========================================================
// READERS
// ========================================================

// Retourne l'ensemble des sélections
export function getSelections() {
  return selectedIds;
}

// Compte les sélections appartenant à un catway
// Format attendu : "catwayNumber|..."
export function countSelectionsByCatway(catwayNumber) {
  return [...selectedIds].filter(id => id.startsWith(`${catwayNumber}|`)).length;
}