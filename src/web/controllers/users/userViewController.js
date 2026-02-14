/**
 * --------------------------------------------------------------------
 * Controlleur de vue - Users
 * --------------------------------------------------------------------
 * - Pages EJS
 * - Panel latéral
 */

import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

import {
  fetchUserById,
  fetchUsers
} from "../../gateways/api/userApi.js";

import {
  mapUserDetail,
  mapUserToForm,
  mapUserToList
} from "../../utils/users/userMapper.js";

import {
  renderCreateUserPage,
  renderEditUserPage
} from "../../views/helpers/usersViewHelper.js";

import { USER_MESSAGES } from "../../../../public/js/messages/userMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

// ==================================================
// USERS LIST
// ==================================================

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
      users: userView
    });

  } catch (error) {
    next(error)
  }
};

/* ==================================================
  USER DETAILS - FULL PAGE
================================================== */

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
      user: userViewModel
    });

  } catch (error) {
    next(error);
  }
};

/* ==================================================
  USER PANEL
================================================== */

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

/* ==================================================
  CREATE USER PAGE
================================================== */

export const getCreateUserPage = (req, res, next) => {
  try {
    renderCreateUserPage(res, {});
  } catch (error) {
    next(error);
  }
};

/* ==================================================
  EDIT USER PAGE
================================================== */

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