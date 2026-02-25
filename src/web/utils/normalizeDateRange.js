/**
 * ===================================================================
 * NORMALIZE DATE (START/END)
 * ===================================================================
 * Normalise une date en début ou fin de journée logique.
 *
 * - "start" → 06:00:00.000
 * - "end"   → 05:59:59.999
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