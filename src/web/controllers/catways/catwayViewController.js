/**
 * ===================================================================
 * VIEW CONTROLLER - CATWAYS
 * ===================================================================
 * - Rendu page EJS
 * - Chargement des données via API gateway
 * - Gestion pannel latéral
 * ===================================================================
 */

import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

import {
  fetchCatways,
  fetchCatwayByNumber
} from "../../gateways/api/catwayApi.js";

import {
  mapCatwayToDetail,
  mapCatwayToForm,
  mapCatwayToList
} from "../../utils/mappers/catwayMapper.js";

import {
  renderCreateCatwayPage,
  renderEditCatwayPage
} from "../../views/helpers/catwaysViewHelper.js";

import { findNextCatwayNumber } from "../../utils/business/catways/findNextCatwayNumber.js";
import { CATWAY_MESSAGES } from "../../../../public/js/messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { loadOtherReservations } from "../../utils/mappers/loadOtherReservations.js";

// ==================================================
// CATWAYS LIST
// ==================================================

export const getCatwaysPage = async (req, res, next) => {
    try {
      const apiData = await fetchCatways(req, res);

      if (handleAuthExpired(apiData, req, res)) return;

      if (!apiData?.success) {
        return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
      }

      const catwaysView = apiData.data.map(mapCatwayToList);

      res.render("catways/list", {
          title: "Liste des catways",
          activePage: "catways",
          catways: catwaysView
      });

    } catch (error) {
        next(error);
    }
};

// ==================================================
// CATWAY DETAILS - FULL PAGE (BY NUMBER)
// ==================================================

export const getCatwayByNumber = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.catwayNumber);

    if (Number.isNaN(catwayNumber)) {
      const error = new Error(CATWAY_MESSAGES.INVALID_NUMBER);
      error.status = 400;
      return next(error);
    }

    const { from, id: reservationId } = req.query;

    const apiData = await fetchCatwayByNumber(catwayNumber, req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData?.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }

    if (!apiData.data) {
      const error = new Error(CATWAY_MESSAGES.NOT_FOUND);
      error.status = 404;
      return next(error);
    }

    const catwayApi = apiData.data;
    const catwayViewModel = mapCatwayToDetail(catwayApi);

    const otherReservations = await loadOtherReservations(catwayNumber, null, req, res);

    res.render("catways/details", {
      title: "Détail catway",
      activePage: "catways",
      catway: catwayViewModel,
      catwayNumber,
      otherReservations,
      from,
      reservationId
    });

  } catch (error) {
    next(error);
  }
};

// ==================================================
// CATWAY PANEL
// ==================================================

export const getCatwayPanel = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.catwayNumber);

    if (Number.isNaN(catwayNumber)) {
      const error = new Error(CATWAY_MESSAGES.INVALID_NUMBER);
      error.status = 400;
      return next(error);
    }

    const apiData = await fetchCatwayByNumber(catwayNumber, req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData?.success) {
      return res.status(500).render("partials/panels/panelError", {
        layout: false,
        message: apiData?.message ||
        COMMON_MESSAGES.SERVER_ERROR_LONG
      });
    }

    if (!apiData.data) {
      return res.status(404).render("partials/panels/panelError", {
        layout: false,
        message: CATWAY_MESSAGES.NOT_FOUND
      });
    }
    
    const catwayApi = apiData.data;
    const catwayViewModel = mapCatwayToDetail(catwayApi);

    res.render("partials/panels/catwayPanel", {
      layout: false,
      entity: catwayViewModel
    });
    
  } catch (error) {
    next(error);
  }
};

// ==================================================
// CREATE CATWAY PAGE
// ==================================================

export const getCreateCatwayPage = async (req, res, next) => {
  try {
    const suggestedNumber = await findNextCatwayNumber();

    renderCreateCatwayPage(res, {
      startNumber: suggestedNumber
    })

  } catch (error) {
    next(error);
  }
};

// ==================================================
// EDIT CATWAY PAGE (BY NUMBER)
// ==================================================

export const getEditCatwayByNumber = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.catwayNumber);

    if (Number.isNaN(catwayNumber)) {
      const error = new Error(CATWAY_MESSAGES.INVALID_NUMBER);
      error.status = 400;
      return next(error);
    }

    const apiData = await fetchCatwayByNumber(catwayNumber, req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData?.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }

    if (!apiData.data) {
      const error = new Error(CATWAY_MESSAGES.NOT_FOUND);
      error.status = 404;
      return next(error);
    }

    const catwayApi = apiData.data;
    const catwayViewModel = mapCatwayToForm(catwayApi);

    renderEditCatwayPage(res, {
      catway: catwayViewModel
    });

  } catch (error) {
    next(error);
  }
};