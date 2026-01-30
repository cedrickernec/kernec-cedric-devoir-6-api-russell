/**
 * ===================================================================
 * NORMALIZE STRING
 * ===================================================================
 * - Supprime les accents
 * - Met en minuscules
 * - Sécurise les recherches (filter)
 * ===================================================================
 */

export function normalizeString(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}