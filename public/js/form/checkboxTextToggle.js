/**
 * ===================================================================
 * CHECKBOX → SYNCRONISATION TEXT INPUT FIELD
 * ===================================================================
 * - Verrouille le textarea quand "bon état" est coché
 * - Injecte "bon état"
 * - Masque / désactive "hors service"
 * - Garantit que ce qui est caché n’est PAS soumis
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  const goodStateCheckbox = document.getElementById("goodStateCheckbox");
  const stateTextarea = document.getElementById("catwayState");
  const outOfServiceCheckbox = document.querySelector(
    'input[name="isOutOfService"]'
  );

  if (!goodStateCheckbox || !stateTextarea) return;

  let previousValue = "";

  if (stateTextarea.value.trim() === "bon état") {
    goodStateCheckbox.checked = true;
  } else {
    goodStateCheckbox.checked = false;
    previousValue = stateTextarea.value;
  }

  const applyState = () => {
    if (goodStateCheckbox.checked) {

      // Sauvegarde ancienne saisie
      if (stateTextarea.value.trim() !== "bon état") {
        previousValue = stateTextarea.value;
      }

      // Force "bon état"
      stateTextarea.value = "bon état";
      stateTextarea.readOnly = true;

      // Désactive + décoche hors service
      if (outOfServiceCheckbox) {
        outOfServiceCheckbox.checked = false;
        outOfServiceCheckbox.disabled = true;
        outOfServiceCheckbox.closest(".form-group")?.classList.add("hidden");
      }

    } else {

      // Restaure saisie
      stateTextarea.readOnly = false;
      stateTextarea.value = previousValue || "";

      // Réactive hors service
      if (outOfServiceCheckbox) {
        outOfServiceCheckbox.disabled = false;
        outOfServiceCheckbox.closest(".form-group")?.classList.remove("hidden");
      }
    }
  };

  goodStateCheckbox.addEventListener("change", applyState);

  // Init au chargement
  applyState();
});