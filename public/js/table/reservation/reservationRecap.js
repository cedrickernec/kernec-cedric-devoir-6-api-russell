/**
 * ===================================================================
 * RESERVATION RECAP DATA EXTRACTOR
 * ===================================================================
 * - Transforme les identifiants sélectionnés en données métier
 * - Convertit les IDs encodés en objets exploitables
 * - Calcule automatiquement la durée de réservation
 * ===================================================================
 * Format attendu du selectionId : "type|catway|from|to"
 * Exemple : partial|12|2026-05-01|2026-05-05
 * ===================================================================
 * Utilisé par reservationValidationController (modale récapitulative)
 * ===================================================================
 */

import { computeNightsBetweenDates } from "../../utils/computeReservationNights.js";

// ========================================================
// DATE FORMATTER
// ========================================================

function formatDateFR(date) {
  return date instanceof Date && !isNaN(date)
    ? date.toLocaleDateString("fr-FR")
    : "-";
}

// ========================================================
// MAIN EXTRACTION
// ========================================================

export function extractReservationData(idsSet) {

  return Array.from(idsSet).map(raw => {

    // Décomposition de l'identifiant encodé
    const [type, catway, from, to] = raw.split("|");

    const start = new Date(from);
    const end   = new Date(to);

    // Calcul métier : nombre de nuits
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