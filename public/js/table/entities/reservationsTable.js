/**
 * RESERVATIONS TABLE MODULE
 * =========================================================================================
 * @module reservationsTable
 *
 * Configure la table des réservations à partir du moteur générique entityTable.
 *
 * Rôle :
 * - Activer la sélection multiple
 * - Activer la suppression en masse
 * - Injecter les messages métier spécifiques aux catways
 *
 * Ce module ne contient aucune logique métier :
 * il se contente de fournir une configuration adaptée.
 */

import { initEntityTable } from "../core/entityTable.js";
import { RESERVATION_MESSAGES } from "../../messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

/**
 * RESERVATIONS TABLE INITIALISATION
 * =========================================================================================
 * Initialise la table des réservations avec sa configuration spécifique.
 *
 * @function initReservationsTable
 * 
 * @returns {void}
 */


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