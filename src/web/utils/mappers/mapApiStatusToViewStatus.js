/**
 * ===================================================================
 * STATUS MAPPER - API → VIEW
 * ===================================================================
 * - Combine le statut métier API avec le statut visuel UI
 * - Conserve la source API (clé/label)
 * - Ajoute les métadonnées d'affichage (classe, aria, sémantic)
 * ===================================================================
 */

import { computeReservationStatus } from "../business/reservations/reservationStatus.js";

export function mapApiStatusToToViewStatus(apiStatus, startDate, endDate) {

    // Calcul du statut UI basé sur les dates
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