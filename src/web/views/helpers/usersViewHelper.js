import { PASSWORD_RULES } from "../../utils/business/users/userValidator.js";

/**
 * VIEW HELPER - CREATE PAGE RENDER
 * =========================================================================================
 * Rend la page de création d'un utilisateur.
 *
 * - Injecte les règles de mot de passe
 * - Centralise erreurs et données formulaire
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
 * VIEW HELPER - EDIT PAGE RENDER
 * =========================================================================================
 * Rend la page d'édition d'un utilisateur.
 *
 * - Injecte les données utilisateur
 * - Injecte les règles de mot de passe
 * - Centralise erreurs
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