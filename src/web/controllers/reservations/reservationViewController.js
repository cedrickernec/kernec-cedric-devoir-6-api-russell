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
        "in-progress": 2,
        finished: 3
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
      const step = req.query.step || "client";

      let preselectedCatway = req.query.preselectedCatway || null;

      if (Array.isArray(preselectedCatway)) {
        preselectedCatway = preselectedCatway[0];
      }

      // Si utilisateur arrive depuis une page hors du formulaire → nouveau formulaire
      const isWizardNavigation = req.query.step !== undefined;

      // Nouvelle entrée → reset complet du draft
      if (!isWizardNavigation) {
        delete req.session.reservationDraft;
        req.session.reservationWizardActive = true;
      }

      // Sécurité : si wizard marqué inactif → nettoyage du brouillon
      if (!req.session.reservationWizardActive) {
        delete req.session.reservationDraft;
      }

      const draft = req.session.reservationDraft || {};

      // Affiche le formulaire client pré-rempli
      if (step === "client") {
        return renderCreateReservationPage(res, {
          step: "client",
          formData: draft,
          preselectedCatway
        });
      }

      // Sécurité : impossible d'accéder à la step 2 sans passer par step 1
      if (step === "dates" && (!draft.clientName || !draft.boatName)) {
        return renderCreateReservationPage(res, {
          step: "client",
          formData: {},
          preselectedCatway,
          globalError: "Veuillez renseigner le client et le bateau avant de choisir des dates."
        });
      }

      // Affichage de step 2
      return renderCreateReservationPage(res, {
        step: "dates",
        formData: draft,
        preselectedCatway,
        hasSearched: false,
        availableCatways: []
      });

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