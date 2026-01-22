/**
 * ============================================================
 * RESERVATION FORMATTER
 * ============================================================
 * - Formate les réponses retournées :
 *      - Nettoie les documents Mongo
 *      - Contrôle les champs exposés
 *      - Définit l'ordre des clés
 * ============================================================
 */

export function formatReservation(reservation) {
    if (!reservation) return null;

    const object = reservation.toObject();

    return {
        catway: {
            number: object.catwayNumber
        },
        client: {
            name: object.clientName,
            boat: object.boatName
        },
        reservation: {
            id: object._id,
            start: object.startDate,
            end: object.endDate,
            createdAt : object.createdAt,
            updatedAt : object.updatedAt
        },
    };
}

export function formatReservationsList(reservations) {

    return reservations.map((reservation) => {
        
        const object = reservation.toObject();

        return {
            id: object._id,
            catwayNumber: object.catwayNumber,
            client: object.clientName,
            boat: object.boatName,
            start: object.startDate,
            end: object.endDate,
            createdAt : object.createdAt,
            updatedAt : object.updatedAt
        };
    });
}