/**
 * ===================================================================
 * USERS TABLE
 * ===================================================================
 * - Initialise la table Users
 * - Configure la sélection multiple
 * - Configure la suppression en masse
 * - Fournit les messages spécifiques aux utilisateurs
 * - Repose sur entityTable et tableCore
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
        deleteUrl: "/users/ajax/",
        deleteType: "user",

        messages: {
            success: USER_MESSAGES.BULK_DELETE_SUCCESS,
            cancelled: COMMON_MESSAGES.DELETE_CANCEL,
            error: COMMON_MESSAGES.DELETE_ERROR,
        }
    });
}