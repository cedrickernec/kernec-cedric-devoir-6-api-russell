/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Catways
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 */

import Catway from "../../../api/models/Catway.js";
import { CATWAY_MESSAGES } from "../../../../public/js/messages/catwayMessages.js";

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
        title: "Modification du catway",
        activePage: "catways",
        catway,
        errors
    });
};

// ==================================================
// CREATE CATWAY
// ==================================================

export const postCreateCatway = async (req, res, next) => {
    try {
        const { catwayNumber, catwayType, catwayState, isOutOfService } = req.body;
        const errors = {};
        const catwayNumberInt = Number(catwayNumber);

        let isOutOfServiceBool = isOutOfService === "on";

        // Validation numéro
        if (!catwayNumber) {
            errors.catwayNumber = CATWAY_MESSAGES.CATWAY_REQUIRED;
        } else if (Number.isNaN(catwayNumberInt) || catwayNumberInt < 1) {
            errors.catwayNumber = CATWAY_MESSAGES.INVALID_CATWAY;
        } else {
            const existing = await Catway.findOne({
                catwayNumber: catwayNumberInt
            });

            if (existing) {
                errors.catwayNumber = CATWAY_MESSAGES.CATWAY_CONFLICT;
            }
        }

        // Validation type
        if (!["short", "long"].includes(catwayType)) {
            return next(new Error(CATWAY_MESSAGES.INVALID_TYPE));
        }

        // Validation état
        if (catwayState === "bon état") {
            isOutOfServiceBool = false
        }

        if (!catwayState || !catwayState.trim()) {
            errors.catwayState = CATWAY_MESSAGES.STATE_REQUIRED;
        }

        // Erreurs → retour formulaire
        if (Object.keys(errors).length > 0) {
            return renderCreateCatwayPage(res, {
                errors,
                formData: req.body
            });
        }

        // Création
        const createdCatway = await Catway.create({
            catwayNumber: catwayNumberInt,
            catwayType,
            catwayState,
            isOutOfService: isOutOfServiceBool
        });

        // Flash + redirect
        req.session.flash = {
            type: "success",
            message: CATWAY_MESSAGES.CREATE_SUCCESS,
            highlightNumber: createdCatway.catwayNumber
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
        const { catwayNumber, catwayType, catwayState, isOutOfService } = req.body;
        const errors = {}
        
        const catway = await Catway.findById(req.params.id);
        if (!catway) return next();
        
        const catwayNumberInt = Number(catwayNumber);

        const isOutOfServiceBool = catwayState === "bon état" ? false : req.body.isOutOfService === "on";

        // Validation numéro
        if (!catwayNumber) {
            errors.catwayNumber = CATWAY_MESSAGES.CATWAY_REQUIRED;
        } else if (Number.isNaN(catwayNumberInt) || catwayNumberInt < 1) {
            errors.catwayNumber = CATWAY_MESSAGES.INVALID_CATWAY;
        } else {
            const existing = await Catway.findOne({
                catwayNumber: catwayNumberInt,
                _id: { $ne: req.params.id }
            });

            if (existing) {
                errors.catwayNumber = CATWAY_MESSAGES.CATWAY_CONFLICT;
            }
        }

        // Validation type
        if (!["short", "long"].includes(catwayType)) {
            errors.catwayType = CATWAY_MESSAGES.INVALID_TYPE;
        }
        
        // Validation état
        if (!catwayState || !catwayState.trim()) {
            errors.catwayState = CATWAY_MESSAGES.STATE_REQUIRED;
        }

        // Erreur → Retour formulaire
        if (Object.keys(errors).length > 0) {
            return renderEditCatwayPage(res, {
                catway,
                errors
            });
        }

        // Update
        await Catway.findByIdAndUpdate(req.params.id, {
            catwayNumber: catwayNumberInt,
            catwayType,
            catwayState,
            isOutOfService: isOutOfServiceBool
        });

        // Flash + redirect
        req.session.flash = {
            type: "success",
            message: CATWAY_MESSAGES.UPDATE_SUCCESS
        }

        res.redirect("/catways");

    } catch (error) {
        next(error);
    }
};