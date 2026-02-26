/**
 * NORMALIZE DATE RANGE MODULE
 * =========================================================================================
 * @module normalizeDateRange
 *
 * Normalise une date en début ou fin de journée logique métier.
 *
 * Responsabilités :
 * - Convertir une date valide
 * - Appliquer une heure métier cohérente
 *
 * Sécurité :
 * - Lance une erreur si la date est invalide
 *
 * Effets de bord :
 * - Modifie l’objet Date localement
 */

/**
 * NORMALIZE DATE RANGE
 * =========================================================================================
 * Normalise une date selon le mode "start" ou "end".
 *
 * @function normalizeDateRange
 *
 * @param {Date|string} date
 * @param {"start"|"end"} [mode="start"]
 *
 * @returns {Date|null}
 *
 * @throws {Error} - Si la date est invalide
 */

export function normalizeDateRange(date, mode = "start") {
  if (!date) return null;

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    throw new Error("Date invalide");
  }

  if (mode === "start") {
    d.setHours(6, 0, 0, 0);
  }

  if (mode === "end") {
    d.setHours(5, 59, 59, 999);
  }

  return d;
}