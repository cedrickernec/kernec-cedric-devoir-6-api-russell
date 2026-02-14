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

  let previousValue = stateTextarea.value;
  let initialized = false;

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
      }

      // Masqué seulement après initialisation
      if (initialized) {
        outOfServiceCheckbox.closest(".form-group")?.classList.add("hidden");
      }

    } else {

      // Restaure saisie
      stateTextarea.readOnly = false;
      stateTextarea.value = previousValue || "";

      // Vidé si on était en "bon état"
      if (stateTextarea.value.trim() === "bon état") {
        stateTextarea.value = "";
      }

      // Réactive hors service
      if (outOfServiceCheckbox) {
        outOfServiceCheckbox.disabled = false;
      }

      if (initialized) {
        outOfServiceCheckbox.closest(".form-group")?.classList.remove("hidden");
      }
    }

    // Informer preventSubmitIfLocked qu'un changement a eu lieu
    const event = new Event("change", { bubbles: true });
    stateTextarea.dispatchEvent(event);
    if (outOfServiceCheckbox) {
      outOfServiceCheckbox.dispatchEvent(event);
    }
    
    initialized = true;
  };

  goodStateCheckbox.addEventListener("change", applyState);

  // Init au chargement
  applyState();
});