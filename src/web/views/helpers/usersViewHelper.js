import { PASSWORD_RULES } from "../../utils/business/users/userValidator.js";

// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

export const renderCreateUserPage = (res, {
  errors = {},
  globalError = null,
  formData = {}
}) => {
  res.render("users/create", {
    title: "Création d'un utilisateur",
    activePage : "users",
    errors,
    globalError,
    formData,
    passwordRules: PASSWORD_RULES
  });
};

// ==================================================
// VIEW HELPER - EDIT PAGE RENDER
// ==================================================

export const renderEditUserPage = (res, {
  user,
  errors = {},
  globalError = null
}) => {
  res.render("users/edit", {
      title: "Modification de l'utilisateur",
      activePage: "users",
      user,
      errors,
      globalError,
      passwordRules: PASSWORD_RULES
  });
};