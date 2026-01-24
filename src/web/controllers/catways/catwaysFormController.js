/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Catways
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 */

import Catway from "../../../api/models/Catway.js";
import { updateCatway, createCatway } from "../../services/api/catwayApi.js";
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
        const token = req.session?.user?.token;

        if (!token) {
            return res.redirect("/login");
        }

        const { catwayNumber, catwayType, catwayState, isOutOfService } = req.body;
        const payload = {
            catwayNumber: Number(catwayNumber),
            catwayType,
            catwayState
        };

        const response = await createCatway(payload, token);
        const errors = {};

        if (!response?.success) {
            return renderCreateCatwayPage(res, {
                errors: response?.errors ?? errors,
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