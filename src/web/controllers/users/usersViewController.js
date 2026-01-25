/**
 * --------------------------------------------------------------------
 * Controlleur de vue - Users
 * --------------------------------------------------------------------
 * - Pages EJS
 * - Panel latéral
 */

import User from "../../../api/models/User.js";
import { PASSWORD_RULES } from "../../utils/users/userValidator.js";
import { mapUserDetail, mapUserToList } from "../../utils/users/userMapper.js";
import { USER_MESSAGES } from "../../../../public/js/messages/userMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { fetchUserById, fetchUsers } from "../../services/api/userApi.js";

// ==================================================
// USERS LIST
// ==================================================

export const getUsersPage = async (req, res, next) => {
  try {
    const apiData = await fetchUsers(req, res);

    if (apiData?.authExpired) return;

    if (apiData?.error) {
      return next (new Error(COMMON_MESSAGES.API_ERROR));
    }

    const userView = apiData.data.map(mapUserToList);

    res.render("users/usersList", {
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
    const user = await User.findById(id).select("-password");

    if (!user) {
      const error = new Error(USER_MESSAGES.NOT_FOUND)
      error.status = 404;
      return next(error);
    }

    const userViewModel = mapUserDetail(user);

    res.render("users/userDetails", {
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

export const getUserPanel = async (req, res) => {
  try {
    const { id } = req.params;

    const apiData = await fetchUserById(id, req, res);

    if (apiData?.authExpired) return;

    if (!apiData || apiData?.error) {
      return next (new Error(COMMON_MESSAGES.SERVER_ERROR_LONG));
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
    res.render("users/userCreate", {
      title: "Création d'un utilisateur",
      activePage: "users",
      errors: {},
      formData: {},
      passwordRules: PASSWORD_RULES
    });
    
  } catch (error) {
    next(error);
  }
};

/* ==================================================
  EDIT USER PAGE
================================================== */

export const getEditUserPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next();
    }

    res.render("users/userEdit", {
      title: "Éditer un utilisateur",
      activePage: "users",
      user,
      errors: {},
      passwordRules: PASSWORD_RULES
    });

  } catch (error) {
    next(error);
  }
};