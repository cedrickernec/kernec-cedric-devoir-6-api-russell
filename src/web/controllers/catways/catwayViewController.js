/**
 * VIEW CONTROLLER - CATWAYS
 * =========================================================================================
 * - Rendu page EJS
 * - Chargement des données via API gateway
 * - Gestion pannel latéral
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

/**
 * CATWAYS LIST
 * =========================================================================================
 * Affiche la liste des catways.
 *
 * - Appelle l'API (gateway) pour récupérer les catways
 * - Gère l'expiration d'authentification
 * - Mappe les données vers un modèle de vue (liste)
 * - Rend la vue EJS correspondante
 *
 * @async
 * @function getCatwaysPage
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

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
          catways: catwaysView,
          bodyClass: "scroll-components catways-page"
      });

    } catch (error) {
        next(error);
    }
};

/**
 * CATWAY DETAILS - FULL PAGE (BY NUMBER)
 * =========================================================================================
 * Affiche le détail d'un catway (par numéro).
 *
 * - Valide et parse catwayNumber via req.params
 * - Appelle l'API (gateway) pour récupérer le catway
 * - Gère l'expiration d'authentification
 * - Gère le cas 404 (catway introuvable)
 * - Charge les autres réservation du cawtay (contexte)
 * - Supporte des paramètres de navigation (from, reservationId)
 * - Mappe les données vers un modèle de vue (détail)
 * - Rend la vue EJS correspondante
 *
 * @async
 * @function getCatwayByNumber
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

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
      bodyClass: "scroll-main details-page",
      catwayNumber,
      otherReservations,
      from,
      reservationId
    });

  } catch (error) {
    next(error);
  }
};

/**
 * CATWAY PANEL
 * =========================================================================================
 * Rend le panneau latéral (partial) d'un catway.
 *
 * - Valide et parse catwayNumber via req.params
 * - Appelle l'API (gateway) pour récupérer le catway
 * - Gère l'expiration d'authentification
 * - Retourne un partial EJS sans layout
 * - En cas d'erreur : rend le parial "pannelError" (404/500)
 * - Mappe les données vers un modèle de vue (détail)
 *
 * @async
 * @function getCatwayPanel
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

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

/**
 * CREATE CATWAY PAGE
 * =========================================================================================
 * Affiche la page de création d'un catway.
 *
 * - Appelle l'API (gateway) pour proposer le prochain numéro disponible
 * - Rend le formulaire EJS de création avec une valeur suggérée pour catwayNumber
 *
 * @async
 * @function getCreateCatwayPage
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */
export const getCreateCatwayPage = async (req, res, next) => {
  try {
    const suggestedNumber = await findNextCatwayNumber(req, res);

    renderCreateCatwayPage(res, {
      startNumber: suggestedNumber
    })

  } catch (error) {
    next(error);
  }
};

/**
 * EDIT CATWAY PAGE (BY NUMBER)
 * =========================================================================================
 * Affiche la page d'édition d'un catway (par numéro).
 *
 * - Valide et parse catwayNumber via req.params
 * - Appelle l'API (gateway) pour charger le catway
 * - Gère l'expiration d'authentification
 * - Gère le 404 (catway introuvable)
 * - Mappe les données vers un modèle de formulaire
 * - Rend la vue EJS correspondante
 *
 * @async
 * @function getEditCatwayByNumber
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

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