/**
 * ===================================================================
 * CLEANING UP FORM ERROR
 * ===================================================================
 * - Supprime les erreurs backend dès la reprise de saisie
 * - Gère les champs liés (dates start / end)
 * - Ignore les règles dynamiques du mot de passe
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  const fields = document.querySelectorAll(
    ".form-group input, .form-group textarea, .form-group select"
  );

  const onFieldEdit = (field) => {

    /* =====================================================
       CAS SPÉCIFIQUE : DATES (startDate / endDate)
       ===================================================== */

    if (field.name === "startDate" || field.name === "endDate") {

      // Supprime l'erreur visuelle du champ modifié
      const formGroup = field.closest(".form-group");
      if (formGroup) {
        formGroup.classList.remove("has-error");
      }

      const datesWrapper = field.closest(".form-group--dates");
      if (!datesWrapper) return;

      // Vérifie s'il reste au moins un champ date encore en erreur
      const remainingErrors =
        datesWrapper.querySelectorAll(".form-group.has-error");

      // Supprime le message global uniquement si plus aucune erreur
      if (remainingErrors.length === 0) {
        datesWrapper
          .querySelectorAll('.form-error[data-error-scope="dates"]')
          .forEach(msg => msg.remove());
      }

      return;
    }

    /* =====================================================
       CAS GÉNÉRAL : TOUS LES AUTRES CHAMPS
       ===================================================== */

    // Le mot de passe a sa propre logique
    if (field.id === "password") return;

    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

    // Suppression de l'état d'erreur
    formGroup.classList.remove("has-error");

    // Suppression des messages d'erreur backend
    formGroup.querySelectorAll(".form-error").forEach((msg) => {

      // Ne pas toucher aux règles dynamiques du password
      if (msg.closest(".password-rules")) return;

      msg.remove();
    });
  };

  // Brancher la logique sur input ET change
  fields.forEach((field) => {
    field.addEventListener("input", () => onFieldEdit(field));
    field.addEventListener("change", () => onFieldEdit(field));
  });

});