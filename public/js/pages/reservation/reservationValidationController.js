/**
 * ===================================================================
 * RESERVATION VALIDATION CONTROLLER
 * ===================================================================
 * - Gère l'action utilisateur "Valider la réservation"
 * - Construit le récapitulatif final
 * - Ouvre la modale de confirmation
 * - Injecte les données dans le formulaire avant submit
 * ===================================================================
 * Responsabilité :
 * - Ce module fait le pont entre :
 *    → la selection UI
 *    → le formulaire HTML
 *    → la confirmation utilisateur
 * ===================================================================
 */

import { getSelections } from "../../table/core/selectionStore.js";
import { extractReservationData } from "../../table/reservation/reservationRecap.js";
import { reservationSummary } from "../../ui/modal/reservationSummary.js";

// ==================================================
// INITIALIZATION
// ==================================================

export function initReservationValidation() {
  const validateBtn = document.getElementById("validate-selection");
  if (!validateBtn) return;

  validateBtn.addEventListener("click", () => {
    const selections = getSelections();
    if (selections.size === 0) return;

    const form = validateBtn.closest("form");
    if (!form) return;

    // ==================================================
    // FORM DATA EXTRACTION
    // ==================================================
    
    // Données issues du formulaire
    const startDate = form.querySelector("[name='startDate']")?.value;
    const endDate = form.querySelector("[name='endDate']")?.value;
    
    // ==================================================
    // SELECTION DATA EXTRACTION
    // ==================================================

    // Données issues de la sélection
    const reservations = extractReservationData(selections, { startDate, endDate });
    
    const summaryData = {
      clientName: form.querySelector("[name='clientName']")?.value || "",
      boatName: form.querySelector("[name='boatName']")?.value || "",
      reservations
    };

    // ==================================================
    // CONFIRMATION MODAL
    // ==================================================

    const summaryNode = reservationSummary({ data: summaryData});

    window.openConfirmModal({
      title: "Confirmer la réservation",
      content: summaryNode,
      onConfirm: () => {
        injectSelectionsIntoForm(form, selections);
        form.submit();
      }
    });
  });
}

// ==================================================
// FORM INJECTION HELPERS
// ==================================================
/**
 * Injecte dynamiquement les catways selectionnés
 * dans le formulaire avant l'envoie serveur.
 * 
 * Permet de conserver une formulaire HTML classique
 * tout en utilisant une sélection dynamique JS.
 */

function injectSelectionsIntoForm(form, idsSet) {

  // Nettoyage des anciennes injections
  form.querySelectorAll('input[name="catways[]"]').forEach(i => i.remove());

  // Injection des nouvelles données
  idsSet.forEach(id => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "catways[]";
    input.value = id;
    form.appendChild(input);
  });
}