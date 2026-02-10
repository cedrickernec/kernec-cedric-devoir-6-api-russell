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
            className: "status--active",
            aria: "Réservation en cours",
            semantic: "active"
        };
    }

    return {
        label: "Terminée",
        className: "status--past",
        aria: "Réservation passée",
        semantic: "past"
    };
}