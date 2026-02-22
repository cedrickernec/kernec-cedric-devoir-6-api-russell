/**
 * ===================================================================
 * USERS TABLE INITIALISER
 * ===================================================================
 * - Configure et initialise la table des utilisateurs
 * - Active la sélection multiple
 * - Active la suppression en masse (bulk delete)
 * - Injecte les messages métier spécifique aux utilisateurs
 * ===================================================================
 * Architecture :
 * → Adaptateur métier au-dessus du moteur générique entityTable
 * ===================================================================
 */

import { initEntityTable } from "../core/entityTable.js";
import { USER_MESSAGES } from "../../messages/userMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

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