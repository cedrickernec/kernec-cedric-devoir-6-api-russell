/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Catways
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 */

import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

import {
    updateCatway,
    createCatway,
    deleteCatway
} from "../../services/api/catwayApi.js";

import {
    renderCreateCatwayPage,
    renderEditCatwayPage
} from "../../views/helpers/catwaysViewHelper.js";

import { handleApiError } from "../../utils/apiErrorHandler.js";

import { CATWAY_MESSAGES } from "../../../../public/js/messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

// ==================================================
// CREATE CATWAY
// ==================================================

export const postCreateCatway = async (req, res, next) => {
    try {
        const { catwayNumber, catwayType, catwayState } = req.body;

        const payload = {
            catwayNumber: Number(catwayNumber),
            catwayType,
            catwayState
        };

        const apiData = await createCatway(payload, req, res);

        if (handleAuthExpired(apiData, req, res)) return;

        if (apiData.success === false) {

            // Erreurs de champs
            if (Object.keys(apiData.errors).length > 0) {
                return renderCreateCatwayPage(res, {
                    errors: apiData.errors,
                    formData: req.body
                });
            }

            // Erreur métier
            if (apiData.context || apiData.message) {
                return renderCreateCatwayPage(res, {
                    globalError: apiData.message,
                    formData: req.body
                });
            }

            // Fallback sécurité
            return renderCreateCatwayPage(res, {
                globalError: COMMON_MESSAGES.SERVER_ERROR_LONG,
                formData: req.body
            });
        }

        req.session.flash = {
            type: "success",
            message: CATWAY_MESSAGES.CREATE_SUCCESS,
            highlightNumber: payload.catwayNumber
        };

        res.redirect("/catways");

    } catch (error) {
        next(error);
    }
};

// ==================================================
// EDIT CATWAY
// ==================================================

export const postEditCatway = async (req, res, next) => {
    try {
        const catwayNumber = Number(req.params.catwayNumber);
        const { catwayState, isOutOfService } = req.body;

        const payload = {
            catwayState,
            isOutOfService: isOutOfService === "on"
        };

        const apiData = await updateCatway(catwayNumber, payload, req, res);

        if (handleAuthExpired(apiData, req, res)) return;

        const errors = apiData.errors || {};

        const catway = {
            number: catwayNumber,
            type: req.body.catwayType,
            state: catwayState,
            isOutOfService: payload.isOutOfService
        }

        if (apiData.success === false) {

            // Erreurs de champs
            if (Object.keys(errors).length > 0) {
                return renderEditCatwayPage(res, {
                    catway,
                    errors
                });
            }

            // Erreur métier
            if (apiData.message) {
                return renderEditCatwayPage(res, {
                    catway,
                    globalError: apiData.message
                });
            }

            // Fallback sécurité
            return renderEditCatwayPage(res, {
                catway,
                globalError: COMMON_MESSAGES.SERVER_ERROR_LONG
            });
        }

        req.session.flash = {
            type: "success",
            message: CATWAY_MESSAGES.UPDATE_SUCCESS
        };

        res.redirect(`/catways/${catwayNumber}`);

    } catch (error) {
        next(error);
    }
};

// ==================================================
// DELETE CATWAY
// ==================================================

export const deleteCatwayAction = async (req, res, next) => {
    try {
        const catwayNumber = Number(req.params.catwayNumber);
        const password = req.body?.password || null;

        const apiResponse = await deleteCatway(catwayNumber, req, res, password);

        if (handleAuthExpired(apiResponse, req, res)) return;

        if (!handleApiError(apiResponse, req, res)) return;

        // MODE AJAX
        if (req.headers.accept?.includes("application/json")) {
            return res.status(200).json({
                success: true
            });
        }

        // MODE CLASSIQUE
        req.session.flash = {
            type: "success",
            message: CATWAY_MESSAGES.DELETE_SUCCESS,
        };

        return res.redirect("/catways");

    } catch (error) {
        next(error);
    }
};