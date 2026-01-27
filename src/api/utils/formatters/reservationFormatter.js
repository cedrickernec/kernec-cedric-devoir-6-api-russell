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
            catwayNumber: object.catwayNumber
        },
        client: {
            clientName: object.clientName,
            boatName: object.boatName
        },
        reservation: {
            id: object._id,
            startDate: object.startDate,
            endDate: object.endDate,
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
            clientName: object.clientName,
            boatName: object.boatName,
            startDate: object.startDate,
            endDate: object.endDate,
            createdAt : object.createdAt,
            updatedAt : object.updatedAt
        };
    });
}