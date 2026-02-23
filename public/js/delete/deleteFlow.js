/**
 * ===================================================================
 * GENERIC DELETE FLOW
 * ===================================================================
 * Centralise tout le workflow de suppression :
 *      → ouverture de la modale de confirmation
 *      → gestion password_required
 *      → appel API DELETE
 *      → gestion des erreurs métier
 *      → feedback utilisateur (toast)
 * ===================================================================
 * Utilisé par :
 *      - suppression simple (entité unique)
 *      - suppression multiple (bulk table)
 *      - suppression sensible (avec confirmation par mot de passe)
 * ===================================================================
 */

/* global showToast */

import { confirmDelete } from "../ui/modal/confirmDelete.js";
import { COMMON_MESSAGES } from "../messages/commonMessages.js";

// ========================================================
// MAIN DELETE FLOW
// ========================================================

export function runDeleteFlow({
    checkUrl,
    deleteUrl,
    deleteType,
    count = 1,
    buildBody,
    onSuccess,
    onCancel
}) {

    // ========================================================
    // MODAL ORCHESTRATION (RECURSIVE FLOW)
    // ========================================================

    const openDeleteModal = ({
        requirePassword = false,
        message = null,
        context = null
    } = {}) => {

        const content = confirmDelete({
            type: deleteType,
            count,
            requirePassword,
            message,
            context
        });

        window.openConfirmModal({
            title: "Confirmation",
            content: content.node,

            // ========================================================
            // CONFIRM ACTION
            // ========================================================

            onConfirm: async () => {

                const password = content.getPassword();

                const body = buildBody
                  ? buildBody(password)
                  : { password };

                if (requirePassword && !password) {
                    showToast("error", "Mot de passe requis.");
                    throw { code: "PASSWORD_REQUIRED" };
                }
                
                if (!password && checkUrl) {
                    const checkRes = await fetch(checkUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify(body)
                    });

                    const checkData = await checkRes.json();

                    if (!checkData.success) {
                        const detail = checkData.context || {};

                        if (detail.reason === "password_required") {
                            openDeleteModal({
                                requirePassword: true,
                                message: checkData.message,
                                context: checkData.context
                            });
                            return false;
                        }

                        showToast("error", checkData.message || COMMON_MESSAGES.DELETE_ERROR);
                        return false;
                    }
                }

                const res = await fetch(deleteUrl, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                const data = await res.json();

                // ========================================================
                // BACKEND RESPONSE HANDLING
                // ========================================================

                if (!data.success) {

                const detail = data.context || {};

                // Le backend exige un mot de passe
                if (detail.reason === "password_required") {
                    openDeleteModal({
                        requirePassword: true,
                        message: data.message,
                        context: data.context
                    });
                    return false;
                }

                // Mot de passe incorrect
                if (detail.reason === "invalid_password") {
                    showToast("error", data.message);
                    throw { code: "PASSWORD_INVALID" };
                }

                // Erreur générique
                showToast("error", data.message || COMMON_MESSAGES.DELETE_ERROR);
                return false;
                }

                // ========================================================
                // SUCCESS CALLBACK
                // ========================================================
                
                if (onSuccess) {
                    onSuccess(data);
                }

                return true;
            },

            // ========================================================
            // CANCEL ACTION
            // ========================================================

            onCancel: () => {
                if (onCancel) {
                    onCancel();
                }
            }
        });
    };

    // ========================================================
    // FLOW INITIALIZATION
    // ========================================================

    openDeleteModal();
}