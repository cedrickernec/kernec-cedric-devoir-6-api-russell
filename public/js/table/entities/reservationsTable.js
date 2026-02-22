/**
 * ===================================================================
 * RESERVATIONS TABLE INITIALISER
 * ===================================================================
 * - Configure et initialise la table des réservations
 * - Active la sélection multiple
 * - Active la suppression en masse (bulk delete)
 * - Injecte les messages métier spécifique aux réservations
 * ===================================================================
 * Architecture :
 * → Adaptateur métier au-dessus du moteur générique entityTable
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
        
        checkUrl: "/ajax/reservations/bulk-check",
        bulkUrl: "/ajax/reservations/bulk",
        deleteType: "reservation",

        messages: {
            success: RESERVATION_MESSAGES.BULK_DELETE_SUCCESS,
            cancelled: COMMON_MESSAGES.DELETE_CANCEL,
            error: COMMON_MESSAGES.DELETE_ERROR,
        }
    });
}