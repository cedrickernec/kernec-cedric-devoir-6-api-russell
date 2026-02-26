/**
 * RESERVATION RECAP MODULE
 * =========================================================================================
 * @module reservationRecap
 *
 * Transforme une sélection encodée en objets métier exploitables
 * pour l'affichage d'un récapitulatif.
 *
 * Format attendu des identifiants :
 * "type|catway|from|to"
 * Exemple : "partial|12|2026-05-01|2026-05-05"
 *
 * Ce module :
 * - Décode les identifiants
 * - Formate les dates pour affichage
 * - Calcule la durée via computeNightsBetweenDates
 */

import { computeNightsBetweenDates } from "../../utils/computeReservationNights.js";

/**
 * EXTRACT RESERVATION DATA
 * =========================================================================================
 * Convertit un Set d'identifiants encodés
 * en tableau d'objets structurés pour l'UI.
 *
 * @function extractReservationData
 * 
 * @param {Set<string>} idsSet
 * 
 * @returns {Array<{
 *   type: string,
 *   catway: number,
 *   startDate: string,
 *   endDate: string,
 *   duration: number|null
 * }>}
 */

export function extractReservationData(idsSet) {

  function formatDateFR(date) {
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleDateString("fr-FR")
      : "-";
  }

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
};