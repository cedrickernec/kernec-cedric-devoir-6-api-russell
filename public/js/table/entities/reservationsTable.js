/**
 * ===================================================================
 * RESERVATIONS TABLE
 * ===================================================================
 * - Initialise la table Reservations
 * - Configure la sélection multiple
 * - Configure la suppression en masse
 * - Fournit les messages spécifiques aux réservations
 * - Repose sur entityTable et tableCore
 * ===================================================================
 */

import { initEntityTable } from "../core/entityTable.js";
import { RESERVATION_MESSAGES } from "../../messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

export function initReservationsTable() {
    initEntityTable({
        tableSelector: ".data-table",
        checkboxName: "selectedReservations",
        deleteBtnId: "delete-selected",
        selectAllId: "select-all",
        deleteUrl: "/reservations/ajax/",
        deleteType: "reservation",

        messages: {
            success: RESERVATION_MESSAGES.BULK_DELETE_SUCCESS,
            cancelled: COMMON_MESSAGES.DELETE_CANCEL,
            error: COMMON_MESSAGES.DELETE_ERROR,
        }
    });
}