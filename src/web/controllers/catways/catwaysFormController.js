/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Catways
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 */

import { updateCatway, createCatway } from "../../services/api/catwayApi.js";
import { CATWAY_MESSAGES } from "../../../../public/js/messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

const renderCreateCatwayPage = (res, {
    errors = {},
    globalError = null,
    formData = {},
    startNumber = null,
    endNumber = null
}) => {
    res.render("catways/catwayCreate", {
        title: "Création d'un catway",
        activePage : "catways",
        errors,
        globalError,
        formData,
        startNumber,
        endNumber
    });
};

// ==================================================
// VIEW HELPER - EDIT PAGE RENDER
// ==================================================

const renderEditCatwayPage = (res, {
    catway,
    errors = {},
}) => {
    res.render("catways/catwayEdit", {
        title: "Édition d'un catway",
        activePage : "catways",
        catway,
        errors
    });
};

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

        if (apiData.authExpired) return;

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
        const { catwayNumber, catwayState, isOutOfService } = req.body;

        const payload = {
            catwayState,
            isOutOfService: isOutOfService === "on"
        };

        const apiData = await updateCatway(Number(catwayNumber), payload, req, res);

        if (apiData?.authExpired) return;

        if (apiData.success === false) {

            // Erreurs de champs
            if (Object.keys(apiData.errors).length > 0) {
                return renderEditCatwayPage(res, {
                    catway: {
                        catwayNumber,
                        catwayState,
                        isOutOfService
                    },
                    errors: apiData.errors
                });
            }

            // Erreur métier
            if (apiData.message) {
                return renderEditCatwayPage(res, {
                    catway: {
                        catwayNumber,
                        catwayState,
                        isOutOfService
                    },
                    errors: {},
                    globalError: apiData.message
                });
            }

            // Fallback sécurité
            return renderEditCatwayPage(res, {
                catway: {
                    catwayNumber,
                    catwayState,
                    isOutOfService
                },
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