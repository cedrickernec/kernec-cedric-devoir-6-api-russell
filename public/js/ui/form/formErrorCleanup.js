/**
 * ===================================================================
 * FORM ERROR CLEANUP
 * ===================================================================
 * - Supprime les erreurs backend dès la reprise de saisie utilisateur
 * - Maintient les erreurs AJAX vérouillées
 * - Gère les champs liés (startDate / endDate)
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

    // Reset état accessibilité
    delete field.dataset.invalid;
    field.removeAttribute("aria-invalid");

    // Suppression des messages backend uniquement
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
  // MAIN FIELD HANDLER
  // =====================================================
  
  const onFieldEdit = (field) => {

    // Nettoyage standard du champ modifié
    clearBackendErrors(field);

    // Synchronisation spécifique des champs dates
    if (field.name === "startDate" || field.name === "endDate") {

      const datesWrapper =
      field.closest(".form-group--dates") ||
      field.closest(".form-group--row") ||
      document;

      const start = datesWrapper.querySelector('input[name="startDate"]');
      const end = datesWrapper.querySelector('input[name="endDate"]');

      if (start) clearBackendErrors(start);
      if (end) clearBackendErrors(end);
    }

    // Suppression erreur métier globale dès qu'on modifie un champ
    const globalErrorBox = document.getElementById("globalErrorBox");

    if (globalErrorBox && globalErrorBox.dataset.errorType === "business") {
      globalErrorBox.remove();
    }
  };

  // =====================================================
  // EVENTS BINDING
  // =====================================================

  fields.forEach((field) => {
    field.addEventListener("input", () => onFieldEdit(field));
    field.addEventListener("change", () => onFieldEdit(field));
  });

});