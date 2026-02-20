/**
 * ===================================================================
 * VIEW CONTROLLER - RESERVATIONS
 * ===================================================================
 * - Rendu page EJS
 * - Chargement des données via API gateway
 * - Gestion pannel latéral
 * ===================================================================
 */

import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

import {
  fetchReservations,
  fetchReservationById
} from "../../gateways/api/reservationApi.js";

import {
  mapReservationToList,
  mapReservationToDetail,
  mapReservationEdit
} from "../../utils/mappers/reservationMapper.js";

import {
  renderCreateReservationPage,
  renderEditReservationPage
} from "../../views/helpers/reservationsViewHelper.js";

import { RESERVATION_MESSAGES } from "../../../../public/js/messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { loadOtherReservations } from "../../utils/mappers/loadOtherReservations.js";

// ==================================================
// RESERVATIONS LIST
// ==================================================

export const getReservationsPage = async (req, res, next) => {
    try {
      const apiData = await fetchReservations(req, res);

      if (handleAuthExpired(apiData, req, res)) return;

      if (!apiData.success) {
        return next(new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
      }

      const reservationsView = apiData.data.map(mapReservationToList);

      const STATUS_ORDER = {
        upcoming: 1,
        active: 2,
        past: 3
      };
      
      reservationsView.sort((a, b) => {

        // Trie par statut
        const statusDiff =
        STATUS_ORDER[a.status.semantic] -
        STATUS_ORDER[b.status.semantic];

        if (statusDiff !== 0) {
          return statusDiff;
        }

        // Trie par date de début
        const startDiff =
        new Date(b.startDate) -
        new Date(a.startDate)

        if (startDiff !== 0) {
          return startDiff;
        }

        // Trie par catway
        return a.catwayNumber - b.catwayNumber;
      });

      res.render("reservations/list", {
          title: "Liste des réservations",
          activePage: "reservations",
          reservations: reservationsView,
          bodyClass: "scroll-components reservations-page",
      });

  } catch (error) {
      next(error);
  }
};

// ==================================================
// RESERVATION DETAILS - FULL PAGE
// ==================================================

export const getReservationById = async (req, res, next) => {
  try {
    const { id, catwayNumber } = req.params;

    if (!catwayNumber) {
      return next(new Error("Numéro de catway manquant."));
    }

    const apiData = await fetchReservationById(catwayNumber, id, req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData?.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }

    if (!apiData.data) {
      const error = new Error(RESERVATION_MESSAGES.NOT_FOUND);
      error.status = 404;
      return next(error);
    }

    const reservationApi = apiData.data;
    const reservationViewModel = mapReservationToDetail(reservationApi);

    res.render("reservations/details", {
      title: "Détail réservation",
      activePage: "reservations",
      reservation: reservationViewModel,
      bodyClass: "scroll-main details-page"
    });

  } catch (error) {
    next(error);
  }
};

// ==================================================
// RESERVATION PANEL
// ==================================================

export const getReservationPanel = async (req, res, next) => {
  try {
    const { id, catwayNumber } = req.params;

    if (!catwayNumber) {
      return next(new Error("Numéro de catway manquant."));
    }

    const apiData = await fetchReservationById(catwayNumber, id, req, res);

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
        message: RESERVATION_MESSAGES.NOT_FOUND
      });
    }

    const reservationApi = apiData.data;
    const reservationViewModel = mapReservationToDetail(reservationApi);

    res.render("partials/panels/reservationPanel", {
      layout: false,
      entity: reservationViewModel
    });
    
  } catch (error) {
    next(error)
  }
};

// ==================================================
// CREATE RESERVATION PAGE
// ==================================================

export const getCreateReservationPage = async (req, res, next) => {
    try {
      const { step } = req.query;

      if (!step) {
        delete req.session.reservationDraft;
      }

      let preselectedCatway = req.query.preselectedCatway || null;

      if (Array.isArray(preselectedCatway)) {
        preselectedCatway = preselectedCatway[0];
      }

      renderCreateReservationPage(res, {});

    } catch (error) {
        next(error);
    }
};

// ==================================================
// EDIT RESERVATION PAGE
// ==================================================

export const getEditReservationPage = async (req, res, next) => {
  try {
    const { id, catwayNumber } = req.params;

    if (!catwayNumber) {
      return next(new Error("Numéro de catway manquant."));
    }

    const apiData = await fetchReservationById(catwayNumber, id, req, res);
    
    if (handleAuthExpired(apiData, req, res)) return;
    
    if (!apiData?.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }
    
    if (!apiData.data) {
      const error = new Error(RESERVATION_MESSAGES.NOT_FOUND);
      error.status = 404;
      return next(error);
    }
    
    const otherReservations = await loadOtherReservations(catwayNumber, id, req, res);

    const reservationApi = apiData.data;
    const reservation = mapReservationEdit(reservationApi);

    reservation.isFinished = reservationApi.reservation.status.key === "FINISHED";

    renderEditReservationPage(res, {
      reservation,
      otherReservations
    });

  } catch (error) {
    next(error);
  }
};