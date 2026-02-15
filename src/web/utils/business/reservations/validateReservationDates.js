/**
 * ===================================================================
 * VALIDATE RESERVATION DATES
 * ===================================================================
 * - Valide la cohérence des dates de réservation
 * - Supporte le mode "édition" avec startDate verrouillée
 * ===================================================================
 */

export function validateReservationDates({
  startDate,
  endDate,
  originalStartDate = null, // en édition
  now = new Date(),
  messages = {}
}) {
  
  const errors = {};

  const MSG_DATES_REQUIRED = messages.DATES_REQUIRED || "Dates requises.";
  const MSG_INVALID_DATES = messages.INVALID_DATES || "Dates invalides.";

  if (!startDate || !endDate) {
    errors.date = MSG_DATES_REQUIRED;
    return { isValid: false, errors };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validité
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime())) {
    errors.date = MSG_INVALID_DATES;
    return { isValid: false, errors };
  }

  // Cohérence
  if (start > end) {
    errors.date = MSG_INVALID_DATES;
    return { isValid: false, errors };
  }

  // Mode édition : start verrouillée
  if (originalStartDate) {
    const originalStart = new Date(originalStartDate);

    if (Number.isFinite(originalStart.getTime())) {
      const isStartLocked = originalStart <= now;

      // Si start verrouillée, on interdit une end < start original
      if (isStartLocked && end < originalStart) {
        errors.endDate = MSG_INVALID_DATES;
        return { isValid: false, errors };
      }
    }
  }

  return { isValid: true, errors: {} };
}