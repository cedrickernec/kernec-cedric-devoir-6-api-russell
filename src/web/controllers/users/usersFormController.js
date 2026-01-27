/**
 * --------------------------------------------------------------------
 * Controlleur de formulaire - Users
 * --------------------------------------------------------------------
 * - Gestion des erreurs de formulaire
 * - Hash bcrypt + update conditionnel du password
 * - Redirections + flash messages
 */

import User from "../../../api/models/User.js";
import bcrypt from "bcrypt";
import {
  validateUserCreate,
  validateUsername,
  validateEmail,
  validatePassword
} from "../../../api/validators/userValidators.js";
import { PASSWORD_RULES } from "../../utils/users/userValidator.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { USER_MESSAGES } from "../../../../public/js/messages/userMessages.js";
import { createUser } from "../../services/api/userApi.js";

// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

const renderCreateUserPage = (res, {
  errors = {},
  formData = {}
}) => {
  res.render("users/userCreate", {
    title: "Création d'un utilisateur",
    activePage : "users",
    errors,
    formData,
    passwordRules: PASSWORD_RULES
  });
};

// ==================================================
// VIEW HELPER - EDIT PAGE RENDER
// ==================================================

const renderEditUserPage = (res, {
  user,
  errors = {}
}) => {
  res.render("users/userEdit", {
      title: "Modification de l'utilisateur",
      activePage: "users",
      user,
      errors,
      passwordRules: PASSWORD_RULES
  });
};

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
    console.log("API USER →", apiData);

    if (apiData?.authExpired) return;

    if (!apiData || apiData?.error) {
        return renderCreateUserPage(res, {
            errors: { global: COMMON_MESSAGES.SERVER_ERROR_LONG },
            formData: { username, email }
        });
    }

    if (apiData?.success === false) {
        return renderCreateUserPage(res, {
            errors: apiData.errors || {},
            formData: { username, email }
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
    const { username, email, password } = req.body;
    const errors = {};
    
    const user = await User.findById(req.params.id);
    if (!user) return next();

    // Validation nom d'utilisateur
    const usernameError = validateUsername(username);
    if (usernameError) {
      errors.username = usernameError;
    }

    // Validation email
    const emailError = validateEmail(email);
    if (emailError) {
      errors.email = emailError;
    } else {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        errors.email = USER_MESSAGES.EMAIL_CONFLICT
      };
    }

    // Validation mot de passe (optionnel)
    if (password && password.trim()) {
      const passwordValidation = validatePassword(password);

      // Règles non respectées
      if (!passwordValidation.valid) {
        errors.password = {
          message: USER_MESSAGES.INVALID_PASSWORD,
          failed: passwordValidation.errors
        };
      } else {
        // Bloque un password identique à l'ancien
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
          errors.password = {
            message: USER_MESSAGES.PASSWORD_CONFLICT
          }
        }
      }
    }

    // Erreur → Retour formulaire
    if (Object.keys(errors).length > 0) {

      return renderEditUserPage(res, {
        user,
        errors
      });
    }

    // Update
    const update = { username, email };

    if (password && password.trim()) {
      update.password = await bcrypt.hash(password, 10);
    }

    await User.findByIdAndUpdate(req.params.id, update);

    // Flash + redirect
    req.session.flash = {
      type: "success",
      message: USER_MESSAGES.UPDATE_SUCCESS
    };

    res.redirect("/users");

  } catch (error) {
    next(error);
  }
};