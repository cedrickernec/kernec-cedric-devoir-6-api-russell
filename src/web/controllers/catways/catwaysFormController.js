/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Catways
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 */

import Catway from "../../../api/models/Catway.js";
import { updateCatway } from "../../services/api/catwayApi.js";
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
        const token = req.session?.user?.token;

        if (!token) {
            return res.redirect("/login");
        }

        const { catwayNumber, catwayState, isOutOfService } = req.body;

        const payload = {
            catwayState,
            isOutOfService: isOutOfService === "on"
        };

        const response = await updateCatway(catwayNumber, payload, token);

        if (!response) {
            return next(new Error("Erreur lors de la mise à jour du catway."));
        }

        req.session.flash = {
            type: "success",
            message: "Catway mis à jour avec succès."
        };

        res.redirect(`/catways/number/${catwayNumber}`);

    } catch (error) {
        next(error);
    }
};