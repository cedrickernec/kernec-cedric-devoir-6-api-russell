import { PASSWORD_RULES } from "../../utils/users/userValidator.js";

// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

export const renderCreateUserPage = (res, {
  errors = {},
  globalError = null,
  formData = {}
}) => {
  res.render("users/userCreate", {
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