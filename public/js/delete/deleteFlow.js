/* global showToast */
import { confirmDelete } from "../ui/modal/confirmDelete.js";
import { COMMON_MESSAGES } from "../messages/commonMessages.js";

export function runDeleteFlow({
    deleteUrl,
    deleteType,
    count = 1,
    buildBody,
    onSuccess,
    onCancel
}) {

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

            onConfirm: async () => {

                const password = content.getPassword();

                const body = buildBody
                  ? buildBody(password)
                  : { password };

                const res = await fetch(deleteUrl, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(body)
                });

                const data = await res.json();

                if (!data.success) {

                const detail = data.context || {};

                if (detail.reason === "password_required") {
                    openDeleteModal({
                        requirePassword: true,
                        message: data.message,
                        context: data.context
                    });
                    return false;
                }

                if (detail.reason === "invalid_password") {
                    showToast("error", data.message);
                    throw { code: "PASSWORD_INVALID" };
                }

                showToast("error", data.message || COMMON_MESSAGES.DELETE_ERROR);
                return false;
                }

                if (onSuccess) {
                    onSuccess(data);
                }

                return true;
            },

            onCancel: () => {
                if (onCancel) {
                    onCancel();
                }
            }
        });
    };

    openDeleteModal();
}