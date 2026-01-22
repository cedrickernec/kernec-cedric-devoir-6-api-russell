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

export const postCreateUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validation standard
    const errors = validateUserCreate({ username, email, password });

    // Vérification email unique
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        errors.email = USER_MESSAGES.EMAIL_CONFLICT;
      }
    }

    // Normalisation du format d'erreur password
    if (errors.password && typeof errors.password === "object") {
      errors.password = {
        message: USER_MESSAGES.INVALID_PASSWORD,
        failed: Object.values(errors.password)
      };
    }

    // Erreurs → retour formulaire
    if (Object.keys(errors).length > 0) {
      return renderCreateUserPage(res, {
        errors,
        formData: { username, email }
      });
    }

    // Hash et création
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      username,
      email,
      password: hashedPassword
    })

    // Flash + redirect
    req.session.flash = {
      type : "success",
      message : USER_MESSAGES.CREATE_SUCCESS,
      highlightId: createdUser._id.toString()
    };

    res.redirect("/users");

  } catch (error) {
    console.error("Erreur création utilisateur :", error);

    return renderCreateUserPage(res, {
      errors: { global: COMMON_MESSAGES.SERVER_ERROR_LONG},
      formData: { username, email }
    });
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