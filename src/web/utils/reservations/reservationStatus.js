import { normalizeDateRange } from "../normalizeDateRange.js";

export function computeReservationStatus({startDate, endDate}) {
    const now = new Date();
    const start = normalizeDateRange(startDate, "start");
    const end = normalizeDateRange(endDate, "end")

    if (now < start) {
        return {
            label: "À venir",
            className: "status--upcoming",
            aria: "Réservation à venir",
            semantic: "upcoming"
        };
    }

    if (now >= start && now <= end) {
        return {
            label: "En cours",
            className: "status--in-progress",
            aria: "Réservation en cours",
            semantic: "in-progress"
        };
    }

    return {
        label: "Terminée",
        className: "status--finished",
        aria: "Réservation terminée",
        semantic: "finished"
    };
}