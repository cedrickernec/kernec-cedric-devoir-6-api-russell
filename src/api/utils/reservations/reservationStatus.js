
import {
    hasReservationStarted,
    isReservationFinished
} from "../../services/reservationRules.js";

export function getReservationStatus(reservation, now = new Date()) {

    if (isReservationFinished(reservation, now)) {
        return {
            key: "FINISHED",
            label: "Terminée"
        };
    }

    if (hasReservationStarted(reservation, now)) {
        return {
            key: "IN_PROGRESS",
            label: "En cours"
        };
    }

    return {
        key: "UPCOMING",
        label: "À venir"
    };;
}