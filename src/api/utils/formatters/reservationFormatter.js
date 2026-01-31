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

export function formatReservation({ reservation, catway }) {
    if (!reservation || !catway) return null;

    const rObject = reservation.toObject();
    const cObject = catway.toObject();

    return {
        catway: {
            catwayNumber: cObject.catwayNumber,
            catwayType: cObject.catwayType
        },
        client: {
            clientName: rObject.clientName,
            boatName: rObject.boatName
        },
        reservation: {
            id: rObject._id,
            startDate: rObject.startDate,
            endDate: rObject.endDate,
            createdAt : rObject.createdAt,
            updatedAt : rObject.updatedAt
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