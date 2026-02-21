/**
 * ===================================================================
 * RESERVATION STATUS COMPUTATION
 * ===================================================================
 * - Détermine le statut temporel d'une réservation
 * - Basé uniquement sur la date actuelle
 * - Retourne les métadonnées UI associées
 * ===================================================================
 */

import { normalizeDateRange } from "../../normalizeDateRange.js";

export function computeReservationStatus({startDate, endDate}) {
    const now = new Date();
    const start = normalizeDateRange(startDate, "start");
    const end = normalizeDateRange(endDate, "end")

    // UPCOMING / À VENIR
    if (now < start) {
        return {
            label: "À venir",
            className: "status--upcoming",
            aria: "Réservation à venir",
            semantic: "upcoming"
        };
    }

    // IN PROGRESS / EN COURS
    if (now >= start && now <= end) {
        return {
            label: "En cours",
            className: "status--in-progress",
            aria: "Réservation en cours",
            semantic: "in-progress"
        };
    }

    // FINISHED / TERMINÉE
    return {
        label: "Terminée",
        className: "status--finished",
        aria: "Réservation terminée",
        semantic: "finished"
    };
}