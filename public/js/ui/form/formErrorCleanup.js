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

  // =====================================================
  // BACKEND ERROR REMOVAL
  // =====================================================

  const clearBackendErrors = (field) => {

    // Ne jamais supprimer une erreur AJAX vérouillée
    if (field.dataset.locked === "true") return;
    
    const formGroup = field.closest(".form-group");
    if (!formGroup) return;

/*     // Ne pas toucher à l'erreur email AJAX
    if (
      field.id === "email" &&
      formGroup.querySelector('.form-error[data-source="ajax"]:not(.hidden)')
    ) {
      return
    } */

    // Nettoyage de l'état visuel
    delete field.dataset.invalid;
    field.removeAttribute("aria-invalid");

    // Suppression des messages backend
    formGroup.querySelectorAll(".form-error").forEach((msg) => {

      // Ne pas toucher aux erreurs AJAX
      if (msg.dataset.source === "ajax") return;

      // Ne pas toucher aux règles password
      if (msg.closest(".password-rules")) return;

      msg.classList.add("hidden");
      msg.textContent = "";
    })
  }

  // =====================================================
  // MAIN HANDLER
  // =====================================================
  const onFieldEdit = (field) => {

    // =====================================================
    // SPECIFIC CASE : DATES (startDate / endDate)
    // =====================================================

    if (field.name === "startDate" || field.name === "endDate") {

      // Supprime l'erreur visuelle du champ modifié
      const formGroup = field.closest(".form-group");
      if (formGroup) clearBackendErrors(field);

      const datesWrapper = field.closest(".form-group--dates");
      if (!datesWrapper) return;

      // Vérifie s'il reste au moins un champ date encore en erreur
      const remainingErrors =
        datesWrapper.querySelectorAll(".form-group.has-error");

      // Supprime le message global uniquement si plus aucune erreur
      if (remainingErrors.length === 0) {
        datesWrapper
          .querySelectorAll('.form-error[data-error-scope="dates"]')
          .forEach((msg) => msg.remove());
      }

      return;
    }

    // =====================================================
    // GENERAL CASE : ALL OTHER FIELDS
    // =====================================================

    clearBackendErrors(field);
  };

  // Brancher la logique sur input ET change
  fields.forEach((field) => {
    field.addEventListener("input", () => onFieldEdit(field));
    field.addEventListener("change", () => onFieldEdit(field));
  });

});