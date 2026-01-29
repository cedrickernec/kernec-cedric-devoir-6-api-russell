/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Users
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Hash bcrypt + update conditionnel du password
 * - Redirections + flash messages
 */

import { createUser, fetchUserById, updatePassword, updateUser } from "../../services/api/userApi.js";
import { renderCreateUserPage, renderEditUserPage } from "../../views/helpers/usersViewHelper.js";
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

    if (apiData?.authExpired) return;

    if (apiData.success === false) {

      // Erreurs de champs
      if (Object.keys(apiData.errors).length > 0) {
        return renderCreateUserPage(res, {
          errors,
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

    if (apiData?.authExpired) return;

    if (apiData.success === false) {

      // Erreurs de champs
      if (Object.keys(errors).length > 0) {
        return renderEditUserPage(res, {
          user,
          errors
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

    if (apiUser?.authExpired) return;

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

    if (apiData?.authExpired) return;

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
          errors: {
            password: {
              message: apiData.message
            }
          }
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
      message: USER_MESSAGES.PASSWORD_UPDATE_SUCCESS
    };

    res.redirect(`/users/${userId}`);

  } catch (error) {
    next(error);
  }
};