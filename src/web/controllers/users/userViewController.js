/**
 * VIEW CONTROLLER - USERS
 * =========================================================================================
 * - Rendu page EJS
 * - Chargement des données via API gateway
 * - Gestion pannel latéral
 */

import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

import {
  fetchUserById,
  fetchUsers
} from "../../gateways/api/userApi.js";

import {
  mapUserDetail,
  mapUserToForm,
  mapUserToList
} from "../../utils/mappers/userMapper.js";

import {
  renderCreateUserPage,
  renderEditUserPage
} from "../../views/helpers/usersViewHelper.js";

import { USER_MESSAGES } from "../../../../public/js/messages/userMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

/**
 * USERS LIST
 * =========================================================================================
 * Affiche la liste des utilisateurs.
 *
 * - Appelle l'API (gateway) pour récupérer les utilisateurs
 * - Gère l'expiration d'authentification
 * - Mappe les données vers un modèle de vue (liste)
 * - Rend la vue EJS correspondante
 *
 * @async
 * @function getUsersPage
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */
export const getUsersPage = async (req, res, next) => {
  try {
    const apiData = await fetchUsers(req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }

    const userView = apiData.data.map(mapUserToList);

    res.render("users/list", {
      title: "Utilisateurs",
      activePage: "users",
      users: userView,
      bodyClass: "scroll-components users-page",
    });

  } catch (error) {
    next(error)
  }
};

/**
 * USER DETAILS - FULL PAGE
 * =========================================================================================
 * Affiche la page détail d'un utilisateur.
 * 
 * - Récupère l'identifiant via req.params
 * - Appelle l'API (gateway) pour récupérer l'utilisateur
 * - Gère l'expiration d'authentification
 * - Gère le cas 404 (utilisateur introuvable)
 * - Mappe les données vers un modèle de vue (détail)
 * - Rend la vue EJS correspondante
 *
 * @async
 * @function getUserById
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const apiData = await fetchUserById(id, req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }

    if (!apiData.data) {
      const error = new Error(USER_MESSAGES.NOT_FOUND);
      error.status = 404;
      return next(error);
    }

    const userApi = apiData.data;
    const userViewModel = mapUserDetail(userApi);

    res.render("users/details", {
      title: "Détail utilisateur",
      activePage: "users",
      user: userViewModel,
      bodyClass: "scroll-main details-page",
    });

  } catch (error) {
    next(error);
  }
};

/**
 * USER PANEL
 * =========================================================================================
 * Rend le panneau latéral (partial) d'un utilisateur.
 *
 * - Récupère l'identifiant via req.params
 * - Appelle l'API (gateway) pour récupérer l'utilisateur
 * - Gère l'expiration d'authentification
 * - Retourne un partial EJS sans layout
 * - En cas d'erreur : rend le parial "pannelError" (404/500)
 * - Mappe les données vers un modèle de vue (détail)
 *
 * @async
 * @function getUserPanel
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */
export const getUserPanel = async (req, res, next) => {
  try {
    const { id } = req.params;

    const apiData = await fetchUserById(id, req, res);

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
        message: USER_MESSAGES.NOT_FOUND
      });
    }

    const userApi = apiData.data;
    const userViewModel = mapUserDetail(userApi);

    res.render("partials/panels/userPanel", {
      layout: false,
      entity: userViewModel
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * CREATE USER PAGE
 * =========================================================================================
 * Affiche la page de création utilisateur.
 * 
 * - Rend le formulaire EJS de création
 *
 * @function getCreateUserPage
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {void}
 */
export const getCreateUserPage = (req, res, next) => {
  try {
    renderCreateUserPage(res, {});
  } catch (error) {
    next(error);
  }
};

/**
 * EDIT USER PAGE
 * =========================================================================================
 * Affiche la page d'édition utilisateur.
 * 
 * - Récupère l'identifiant via req.params
 * - Appelle l'API (gateway) pour charger l'utilisateur
 * - Gère l'expiration d'authentification
 * - Gère le 404 (utilisateur introuvable)
 * - Mappe les données vers un modèle de formulaire
 * - Rend la vue EJS correspondante
 *
 * @async
 * @function getEditUserPage
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

export const getEditUserPage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiData = await fetchUserById(id, req, res);

    if (handleAuthExpired(apiData, req, res)) return;

    if (!apiData.success) {
      return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
    }

    if (!apiData.data) {
      const error = new Error(USER_MESSAGES.NOT_FOUND);
      error.status = 404;
      return next(error);
    }

    const userApi = apiData.data;
    const userViewModel = mapUserToForm(userApi);

    renderEditUserPage(res, {
      user: userViewModel
    });

  } catch (error) {
    next(error);
  }
};