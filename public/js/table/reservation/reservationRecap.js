/**
 * ===================================================================
 * RESERVATION RECAP (DATE EXTRACTOR)
 * ===================================================================
 * - Interprète les selections
 * - Retourne les données exploitables
 * ===================================================================
 */

import { computeNightsBetweenDates } from "../../utils/computeReservationNights.js";

function formatDateFR(date) {
  return date instanceof Date && !isNaN(date)
    ? date.toLocaleDateString("fr-FR")
    : "-";
}

export function extractReservationData(idsSet) {

  return Array.from(idsSet).map(raw => {

    const [type, catway, from, to] = raw.split("|");

    const start = new Date(from);
    const end   = new Date(to);

    const days = computeNightsBetweenDates(start, end);

    return {
      type,
      catway: Number(catway),
      startDate: formatDateFR(start),
      endDate: formatDateFR(end),
      duration: days,
    };
  });
}