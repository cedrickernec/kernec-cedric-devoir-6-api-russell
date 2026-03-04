/**
 * VIEW HELPER - USERS
 * =========================================================================================
 * @module usersViewHelper
 *
 * Helpers de rendu pour les pages Utilisateurs.
 *
 * Responsabilités :
 * - Injecter les règles de mot de passe
 * - Centraliser erreurs et données formulaire
 * - Uniformiser les layouts
 *
 * Dépendances :
 * - PASSWORD_RULES
 *
 * Effets de bord :
 * - Appel direct à res.render()
 */

import { PASSWORD_RULES } from "../../utils/business/users/userValidator.js";

/**
 * RENDER CREATE USER PAGE
 * =========================================================================================
 * Rend la page de création d’un utilisateur.
 *
 * @function renderCreateUserPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 * @param {Object} [params.formData]
 *
 * @returns {void}
 */

export const renderCreateUserPage = (res, {
  errors = {},
  globalError = null,
  formData = {}
}) => {
  res.render("users/create", {
    title: "Création d'un utilisateur",
    activePage : "users",
    bodyClass: "scroll-main create-page",
    errors,
    globalError,
    formData,
    passwordRules: PASSWORD_RULES
  });
};

/**
 * RENDER EDIT USER PAGE
 * =========================================================================================
 * Rend la page d’édition d’un utilisateur.
 *
 * @function renderEditUserPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {Object} params.user
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 *
 * @returns {void}
 */

export const renderEditUserPage = (res, {
  user,
  errors = {},
  globalError = null
}) => {
  res.render("users/edit", {
      title: "Modification de l'utilisateur",
      activePage: "users",
      bodyClass: "scroll-main edit-page",
      user,
      errors,
      globalError,
      passwordRules: PASSWORD_RULES
  });
};