/**
 * ===================================================================
 * RESERVATION RECAP (DATE EXTRACTOR)
 * ===================================================================
 * - Interprète les selections
 * - Retourne les données exploitables
 * ===================================================================
 */

import { computeDurationDays } from "../../utils/computeDurationDays.js";

function formatDateFR(date) {
  return date instanceof Date && !isNaN(date)
    ? date.toLocaleDateString("fr-FR")
    : "-";
}

export function extractReservationData(idsSet, formDates = {}) {
  const formStart = formDates.startDate ? new Date(formDates.startDate) : null;
  const formEnd   = formDates.endDate   ? new Date(formDates.endDate)   : null;

  return Array.from(idsSet).map(raw => {
    const parts = raw.split("|");

    // ==============================
    // RÉSERVATION COMPLÈTE
    // ==============================
    if (parts.length === 1) {
      const days = computeDurationDays(formStart, formEnd);
      const catway = Number(parts[0]);

      return {
        type: "full",
        catway,
        startDate: formatDateFR(formStart),
        endDate: formatDateFR(formEnd),
        duration: days,
      };
    }

    // ==============================
    // RÉSERVATION PARTIELLE
    // ==============================
    const [catway, from, to] = parts;
    const start = new Date(from);
    const end = new Date(to);
    const days = computeDurationDays(start, end);

    return {
      type: "partial",
      catway,
      startDate: formatDateFR(start),
      endDate: formatDateFR(end),
      duration: days,
    };
  });
}