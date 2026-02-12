import { computeReservationStatus } from "./reservationStatus.js";

export function mapApiStatusToToViewStatus(apiStatus, startDate, endDate) {

    const computed = computeReservationStatus({
        startDate,
        endDate
    });

    const status = {
        key: apiStatus.key,
        label: apiStatus.label,
        className: computed.className,
        aria: computed.aria,
        semantic: computed.semantic
    }

    return status;
}