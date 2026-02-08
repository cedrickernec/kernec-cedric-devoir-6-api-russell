/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Users
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Hash bcrypt + update conditionnel du password
 * - Redirections + flash messages
 */

import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

import {
  createUser,
  deleteUser,
  fetchUserById,
  updatePassword,
  updateUser
} from "../../services/api/userApi.js";

import {
  renderCreateUserPage,
  renderEditUserPage
} from "../../views/helpers/usersViewHelper.js";

import { formatApiErrors } from "../../utils/formatApiErrors.js";
import { handleApiError } from "../../utils/apiErrorHandler.js";

import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { USER_MESSAGES } from "../../../../public/js/messages/userMessages.js";

// ==================================================
// CREATE USER
// ==================================================

export const postCreateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    const payload = {
      username,
      email,
      password
    }

    const apiData = await createUser(payload, req, res);

    const formData = {
      username,
      email
    }

    if (handleAuthExpired(apiData, req, res)) return;

    if (apiData.success === false) {

      // Erreurs de champs
      if (Object.keys(apiData.errors).length > 0) {
        return renderCreateUserPage(res, {
          errors: formatApiErrors(apiData),
          formData
        });
      }

      // Erreur métier
      if (apiData.context || apiData.message) {
        return renderCreateUserPage(res, {
          globalError: apiData.message,
          formData
        });
      }

      // Fallback sécurité
      return renderCreateUserPage(res, {
        globalError: COMMON_MESSAGES.SERVER_ERROR_LONG,
        formData
      });
    }

    req.session.flash = {
      type : "success",
      message : USER_MESSAGES.CREATE_SUCCESS,
      highlightId: apiData.data.id
    };

    res.redirect("/users");

  } catch (error) {
    next(error);
  }
};

/* ==================================================
  EDIT USER 
================================================== */

export const postEditUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.params.id;

    const payload = {
      username,
      email
    }

    const apiData = await updateUser(userId, payload, req, res);
    const errors = apiData.errors || {};
    
    const user = {
      id: userId,
      username,
      email
    };

    if (handleAuthExpired(apiData, req, res)) return;

    if (apiData.success === false) {

      // Erreurs de champs
      if (Object.keys(errors).length > 0) {
        return renderEditUserPage(res, {
          user,
          errors: formatApiErrors(apiData)
        });
      }

      // Erreur métier
      if (apiData.context || apiData.message) {
        return renderEditUserPage(res, {
          user,
          globalError: apiData.message
        });
      }

      // Fallback sécurité
      return renderEditUserPage(res, {
        user,
        globalError: COMMON_MESSAGES.SERVER_ERROR_LONG
      });
    }

    req.session.flash = {
      type: "success",
      message: USER_MESSAGES.UPDATE_SUCCESS
    };

    res.redirect(`/users/${userId}`);

  } catch (error) {
    next(error);
  }
};

/* ==================================================
  EDIT USER PASSWORD
================================================== */

export const postEditUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.params.id;

    const apiUser = await fetchUserById(userId, req, res);

    if (handleAuthExpired(apiUser, req, res)) return;

    if (!apiUser.success || !apiUser.data) {
      return renderEditUserPage(res, {
        user: { id: userId },
        globalError: COMMON_MESSAGES.SERVER_ERROR_LONG
      });
    }

    const user = apiUser.data;

    const payload = {
      newPassword: password
    };

    const apiData = await updatePassword(userId, payload, req, res);
    const errors = apiData.errors || {};

    if (handleAuthExpired(apiData, req, res)) return;

    if (apiData.success === false) {

      // Erreur de règles password
      if (Object.keys(errors).length > 0) {
        return renderEditUserPage(res, {
          user,
          errors: {
            password: {
              message: apiData.message,
              errors
            }
          }
        });
      }

      // Erreur métier
      if (apiData.message) {
        return renderEditUserPage(res, {
          user,
          errors: formatApiErrors(apiData)
        });
      }

      // Fallback sécurité
      return renderEditUserPage(res, {
        user,
        globalError: COMMON_MESSAGES.SERVER_ERROR_LONG
      });
    }

    console.log("erreur backend", errors);

    req.session.flash = {
      type: "success",
      message: USER_MESSAGES.PASSWORD_UPDATE_SUCCESS
    };

    res.redirect(`/users/${userId}`);

  } catch (error) {
    next(error);
  }
};

// ==================================================
// DELETE USER
// ==================================================

export const deleteUserAction = async (req, res, next) => {
    try {
        const { id } = req.params;

        const apiResponse = await deleteUser(id, req, res);

        if (handleAuthExpired(apiResponse, req, res)) return;

        if (!handleApiError(apiResponse, req, res)) return;

        // MODE AJAX
        if (req.headers.accept?.includes("application/json")) {
            return res.status(200).json({
                success: true
            });
        }

        // MODE CLASSIQUE
        req.session.flash = {
            type: "success",
            message: USER_MESSAGES.DELETE_SUCCESS,
        };

        return res.redirect("/users");

    } catch (error) {
        next(error);
    }
};