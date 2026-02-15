/**
 * ===================================================================
 * NORMALIZE STRING
 * ===================================================================
 * - Normalise une chaîne pour la recherche
 * - Supprime les accents
 * - Convertit en minuscules
 * - Sécurise les filtres et comparaisons texte
 * ===================================================================
 */

export function normalizeString(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")                 // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, ""); // Supprime les diacritiques
}