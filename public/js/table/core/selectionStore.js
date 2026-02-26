/**
 * GLOBAL SELECTION STORE
 * =========================================================================================
 * @module selectionStore
 *
 * Stockage centralisé des identifiants sélectionnés.
 *
 * Objectif :
 * - Maintenir une sélection persistante
 * - Décorréler l’état mémoire du DOM
 * - Permettre une synchronisation multi-composants
 *
 * La sélection vit uniquement en mémoire applicative.
 */

/**
 * SELECTED IDs
 * =========================================================================================
 * Ensemble interne des identifiants sélectionnés.
 *
 * @type {Set<string>}
 */

export const selectedIds = new Set();

/**
 * ADD SELECTION
 * =========================================================================================
 * Ajoute un identifiant à la sélection globale.
 *
 * @function addSelection
 * 
 * @param {string} id
 * 
 * @returns {void}
 */

export function addSelection(id) {
  selectedIds.add(id);
}

/**
 * REMOVE SELECTION
 * =========================================================================================
 * Retire un identifiant de la sélection globale.
 *
 * @function removeSelection
 * 
 * @param {string} id
 * 
 * @returns {void}
 */

export function removeSelection(id) {
  selectedIds.delete(id);
}

/**
 * HAS SELECTION
 * =========================================================================================
 * Vérifie si un identifiant est sélectionné.
 *
 * @function hasSelection
 * 
 * @param {string} id
 * 
 * @returns {boolean}
 */

export function hasSelection(id) {
  return selectedIds.has(id);
}

/**
 * CLEAR SELECTIONS
 * =========================================================================================
 * Vide complètement la sélection.
 * 
 * @function clearSelections
 * 
 * @returns {void}
 */

export function clearSelections() {
  selectedIds.clear();
}

/**
 * GET SELECTIONS
 * =========================================================================================
 * Retourne l'ensemble des identifiants sélectionnés.
 *
 * @function getSelections
 * 
 * @returns {Set<string>}
 */

export function getSelections() {
  return selectedIds;
}

/**
 * COUNT SELECTIONS BY CATWAY
 * =========================================================================================
 * Compte les sélections appartenant à un catway donné.
 *
 * @function countSelectionsByCatway
 * 
 * @param {string|number} catwayNumber
 * 
 * @returns {number}
 */

export function countSelectionsByCatway(catwayNumber) {
  return [...selectedIds].filter(id => id.startsWith(`${catwayNumber}|`)).length;
}