/**
 * --------------------------------------------------------------------
 * Controlleur de vue - Catways
 * --------------------------------------------------------------------
 * - Pages EJS
 * - Panel latéral
 */

import {
  fetchCatways,
  fetchCatwaysByNumber
} from "../../services/api/catwayApi.js";
import { findNextCatwayNumber } from "../../utils/catways/findNextCatwayNumber.js";
import { mapCatwayToDetail, mapCatwayToForm, mapCatwayToList } from "../../utils/catways/catwayMapper.js";
import { CATWAY_MESSAGES } from "../../../../public/js/messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

/* ==================================================
  CATWAYS LIST
================================================== */

export const getCatwaysPage = async (req, res, next) => {
    try {
      console.log("SESSION USER :", req.session.user);
      const token = req.session?.user?.token;

      if (!token) {
        return res.redirect("/login");
      }

      const catwaysApi = await fetchCatways(token);

      if (!catwaysApi) {
        return next(new Error("Impossible de charger les catways depuis l'API."));
      }

      const catwaysView = catwaysApi.data.map(mapCatwayToList);

      res.render("catways/catwaysList", {
          title: "Liste des catways",
          activePage: "catways",
          catways: catwaysView
      });

    } catch (error) {
        next(error);
    }
};

/* ==================================================
  CATWAY DETAILS - FULL PAGE (BY ID)
================================================== */

/* export const getCatwayById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { from, id: reservationId } = req.query;
    const catway = await Catway.findById(id);

    if (!catway) {
      const error = new Error(CATWAY_MESSAGES.NOT_FOUND)
      error.status = 404;
      return next(error);
    }

    const catwayViewModel = mapCatwayToDetail(catway);

    res.render("catways/catwayDetails", {
      title: "Détail catway",
      activePage: "catways",
      catway: catwayViewModel,
      from,
      reservationId
    });

  } catch (error) {
    next(error);
  }
}; */

/* ==================================================
  CATWAY DETAILS - FULL PAGE (BY NUMBER)
================================================== */

export const getCatwayByNumber = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.catwayNumber);
    const { from, id: reservationId } = req.query;
    const token = req.session?.user?.token;

    if (!token) {
      return res.redirect("/login");
    }

    const response = await fetchCatwaysByNumber(catwayNumber, token);

    if (!response?.data) {
      const error = new Error("Catway introuvable.");
      error.status = 404;
      return next(error);
    }

    const catwayApi = response.data;
    const catwayViewModel = mapCatwayToDetail(catwayApi);

    res.render("catways/catwayDetails", {
      title: "Détail catway",
      activePage: "catways",
      catway: catwayViewModel,
      catwayId: catwayApi.id,
      from,
      reservationId
    });

  } catch (error) {
    next(error);
  }
};

/* ==================================================
  CATWAY PANEL
================================================== */

export const getCatwayPanel = async (req, res) => {
  try {
    const { id } = req.params;
    const catway = await Catway.findById(id);

    if (!catway) {
      return res.status(404).render("partials/panels/panelError", {
        layout: false,
        message: CATWAY_MESSAGES.NOT_FOUND
      });
    }

    const catwayViewModel = mapCatwayToDetail(catway);

    res.render("partials/panels/catwayPanel", {
      layout: false,
      entity: catwayViewModel
    });
    
  } catch (error) {
    console.error("Erreur chargement panel catway :", error);

    res.status(500).render("partials/panels/panelError", {
      layout: false,
      message: COMMON_MESSAGES.LOAD_ERROR
    })
  }
};

/* ==================================================
  CREATE CATWAY PAGE
================================================== */

export const getCreateCatwayPage = async (req, res, next) => {
  try {
    const suggestedNumber = await findNextCatwayNumber();

    res.render("catways/catwayCreate", {
        title: "Créer un catway",
        activePage: "catways",
        suggestedNumber,
        errors: {},
        formData: {}
    });

  } catch (error) {
    next(error);
  }
};

/* ==================================================
  EDIT CATWAY PAGE (BY ID)
================================================== */

/* export const getEditCatwayById = async (req, res, next) => {
  try {
    const catway = await Catway.findById(req.params.id);

    if (!catway) {
      return next();
    }

    res.render("catways/catwayEdit", {
      title: "Éditer un catway",
      activePage: "catways",
      catway,
      errors: {},
    });

  } catch (error) {
    next(error);
  }
}; */

/* ==================================================
  EDIT CATWAY PAGE (BY NUMBER)
================================================== */

export const getEditCatwayByNumber = async (req, res, next) => {
  try {
    const catwayNumber = Number(req.params.catwayNumber);
    const token = req.session?.user?.token;

    if (!token) {
      return res.redirect("/login");
    }

    const response = await fetchCatwaysByNumber(catwayNumber, token);

    if (!response?.data) {
      const error = new Error("Catway introuvable.");
      error.status = 404;
      return next(error);
    }

    const catwayApi = response.data;
    const catwayViewModel = mapCatwayToForm(catwayApi);

    res.render("catways/catwayEdit", {
      title: "Éditer un catway",
      activePage: "catways",
      catway: catwayViewModel,
      errors: {},
    });

  } catch (error) {
    next(error);
  }
};