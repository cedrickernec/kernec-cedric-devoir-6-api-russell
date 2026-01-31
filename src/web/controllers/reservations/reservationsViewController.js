/**
 * ===================================================================
 * VIEW CONTROLLER - RESERVATIONS
 * ===================================================================
 * - Pages EJS
 * - Panel latéral
 * ===================================================================
 */

import {
  fetchReservations,
  fetchReservationsByCatway,
  fetchReservationById
} from "../../services/api/reservationApi.js";

import {
  mapReservationToList,
  mapReservationToDetail,
  mapReservationEdit
} from "../../utils/reservations/reservationMapper.js";

import { RESERVATION_MESSAGES } from "../../../../public/js/messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

// ==================================================
// RESERVATIONS LIST
// ==================================================

export const getReservationsPage = async (req, res, next) => {
    try {
      const {
        catway,
        search,
        startDate,
        endDate
      } = req.query;

      const filters = { catway, search, startDate, endDate };

      let apiData = await fetchReservations(req, res);

      if (!apiData.success) {
        return next(new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
      }

      const reservationsView = apiData.data.map(mapReservationToList);

      // Filtrage
      if (catway) {
        reservationsView = reservationsView.filter(r =>
          Number(r.catwayNumber) === Number(catway)
        );
      }

      if (search) {
        const q = search.toLowerCase();

        reservationsView = reservationsView.filter(r => 
          r.clientName.toLocaleLowerCase().includes(q) ||
          r.boatName.toLocaleLowerCase().includes(q)
        );
      }

      if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        reservationsView = reservationsView.filter(r => {
          if (start && r.endDate < start) return false;
          if (end && r.startDate > end) return false;
          return true
        });
      }

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

      res.render("reservations/reservationsList", {
          title: "Liste des réservations",
          activePage: "reservations",
          reservations: reservationsView,
          filters
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
    const { id } = req.params;
    const { catway } = req.query;

    const apiData = await fetchReservationById(catway, id, req, res);

    if (apiData?.authExpired) return;

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

    res.render("reservations/reservationDetails", {
      title: "Détail réservation",
      activePage: "reservations",
      reservation: reservationViewModel
    });

  } catch (error) {
    next(error);
  }
};

// ==================================================
// RESERVATION PANEL
// ==================================================

export const getReservationPanel = async (req, res) => {
  try {
    const { id } = req.params;
    const { catway } = req.query;

    const apiData = await fetchReservationById(catway, id, req, res);

    if (apiData?.authExpired) return;

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

      res.render("reservations/reservationCreate", {
          title: "Créer une réservation",
          activePage: "reservations",
          step: "client",
          errors: {},
          formData: req.session.reservationDraft || {},
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
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return next();

    const otherReservations = await Reservation.find({
      catwayNumber: reservation.catwayNumber,
      _id: { $ne: reservation._id }
    }).sort({ startDate: 1 });

    res.render("reservations/reservationEdit", {
      title: "Éditer une réservation",
      activePage: "reservations",

      reservation: mapReservationEdit(reservation),
      otherReservations: otherReservations.map(mapReservationToList),

      errors: {},
      formData: {}
    });

  } catch (error) {
    next(error);
  }
};