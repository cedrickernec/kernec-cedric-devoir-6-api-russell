/**
 * USERS TABLE MODULE
 * =========================================================================================
 * @module usersTable
 *
 * Configure la table des utilisateurs à partir du moteur générique entityTable.
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
import { USER_MESSAGES } from "../../messages/userMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

/**
 * USERS TABLE INITIALISATION
 * =========================================================================================
 * Initialise la table des utilisateurs avec sa configuration spécifique.
 *
 * @function initUsersTable
 * 
 * @returns {void}
 */

export function initUsersTable() {
    initEntityTable({
        tableSelector: ".data-table",
        checkboxName: "selectedUsers",
        deleteBtnId: "delete-selected",
        selectAllId: "select-all",
        
        checkUrl: null,
        bulkUrl: "/ajax/users/bulk",
        deleteType: "user",

        messages: {
            success: USER_MESSAGES.BULK_DELETE_SUCCESS,
            cancelled: COMMON_MESSAGES.DELETE_CANCEL,
            error: COMMON_MESSAGES.DELETE_ERROR,
        }
    });
}