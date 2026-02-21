/**
 * ===================================================================
 * CHECKBOX STATE SYNCHRONISATION - CATWAY STATE MANAGEMENT
 * ===================================================================
 * - Synchronise la checkbox "bon état" avec le textearea d'état
 * - Force la valeur "bon état" en mode verouillé
 * - Masque / désactive la checkbox "hors service"
 * - Garantit que les champs masqués ne soient jamais soumis
 * ===================================================================
 * Fonctionne pour :
 *    - Création (état par défaut)
 *    - Édition (réinjection des données existantes)
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // ========================================================
  // DOM REFERENCE
  // ========================================================

  const goodStateCheckbox = document.getElementById("goodStateCheckbox");
  const stateTextarea = document.getElementById("catwayState");
  const outOfServiceCheckbox = document.querySelector(
    'input[name="isOutOfService"]'
  );

  if (!goodStateCheckbox || !stateTextarea) return;

  // ========================================================
  // INTERNAL STATE
  // ========================================================

  let previousValue = stateTextarea.value;
  let initialized = false;

  // ========================================================
  // STATE SYNCHRONISATION
  // ========================================================

  const applyState = () => {
    if (goodStateCheckbox.checked) {

      // Sauvegarde ancienne saisie
      if (stateTextarea.value.trim() !== "bon état") {
        previousValue = stateTextarea.value;
      }

      // Vérouille le textarea → Force "bon état"
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

      // Restaure saisie personnalisée
      stateTextarea.readOnly = false;
      stateTextarea.value = previousValue || "";

      // Nettoie si ancien état automatique
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

    // Informe preventSubmitIfLocked qu'un changement a eu lieu
    const event = new Event("change", { bubbles: true });
    stateTextarea.dispatchEvent(event);
    if (outOfServiceCheckbox) {
      outOfServiceCheckbox.dispatchEvent(event);
    }
    
    initialized = true;
  };

  // ========================================================
  // EVENTS
  // ========================================================

  goodStateCheckbox.addEventListener("change", applyState);

  // Init au chargement
  applyState();
});