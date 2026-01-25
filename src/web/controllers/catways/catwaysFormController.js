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
    formData = {},
    startNumber = null,
    endNumber = null
}) => {
    res.render("catways/catwayCreate", {
        title: "Création d'un catway",
        activePage : "catways",
        errors,
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

        if (apiData?.authExpired) return;

        if (!apiData || apiData?.error) {
            return renderCreateCatwayPage(res, {
                errors: { global: COMMON_MESSAGES.SERVER_ERROR_LONG },
                formData: req.body
            });
        }

        if (apiData?.success === false) {
            return renderCreateCatwayPage(res, {
                errors: apiData.errors || {},
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

        if (!apiData || apiData?.error) {
            return renderEditCatwayPage(res, {
                catway: {
                    catwayNumber,
                    catwayState,
                    isOutOfService
                },
                errors: { global: COMMON_MESSAGES.SERVER_ERROR_LONG }
            });
        }

        if (apiData?.success === false) {
            return renderEditCatwayPage(res, {
                catway: {
                    catwayNumber,
                    catwayState,
                    isOutOfService
                },
                errors: apiData.errors
            });
        }

        req.session.flash = {
            type: "success",
            message: CATWAY_MESSAGES.UPDATE_SUCCESS
        };

        res.redirect(`/catways/number/${catwayNumber}`);

    } catch (error) {
        next(error);
    }
};