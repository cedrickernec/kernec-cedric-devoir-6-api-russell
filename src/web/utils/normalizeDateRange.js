/**
 * ===================================================================
 * NORMALIZE DATE (START/END)
 * ===================================================================
 * - Normalise la date de début et de fin d'une journée
 * ===================================================================
 * @param {Date|string} date
 * @param {"start"|"end"} mode
 * @returns {Date}
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