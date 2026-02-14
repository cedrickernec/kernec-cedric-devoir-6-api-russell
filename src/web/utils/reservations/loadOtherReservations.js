import { fetchReservationsByCatway } from "../../gateways/api/reservationApi.js";
import { mapReservationToList } from "./reservationMapper.js";

export async function loadOtherReservations(catwayNumber, currentId, req, res) {

    const apiAll = await fetchReservationsByCatway(catwayNumber, req, res);

    if (!apiAll?.success || !Array.isArray(apiAll.data)) {
        return [];
    }

    return apiAll.data
    .filter(reservation => reservation.id !== currentId)
    .map(mapReservationToList);
}