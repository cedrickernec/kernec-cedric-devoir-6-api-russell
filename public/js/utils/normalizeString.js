/**
 * NORMALIZE STRING MODULE
 * =========================================================================================
 * @module normalizeString
 *
 * Normalise une chaîne pour des comparaisons
 * insensibles aux accents et à la casse.
 *
 * Utilisé principalement pour les recherches texte côté UI.
 */

/**
 * NORMALIZE STRING
 * =========================================================================================
 * Normalise une chaîne :
 * - Conversion en minuscules
 * - Suppression des diacritiques
 *
 * @function normalizeString
 * @param {string} [str=""]
 * @returns {string}
 */

export function normalizeString(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")                 // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, ""); // Supprime les diacritiques
}