/**
 * ===================================================================
 * RESERVATION VALIDATION
 * ===================================================================
 * - Gère le clic sur le bouton "Valider"
 * - Construit le récapitulatif
 * - Ouvre la modale de confirmation
 * - Injecte les données avant soumission
 * ===================================================================
 */

import { getSelections } from "../../table/core/selectionStore.js";
import { extractReservationData } from "../../table/reservation/reservationRecap.js";
import { reservationSummary } from "../../ui/modal/reservationSummary.js";

export function initReservationValidation() {
  const validateBtn = document.getElementById("validate-selection");
  if (!validateBtn) return;

  validateBtn.addEventListener("click", () => {
    const selections = getSelections();
    if (selections.size === 0) return;

    const form = validateBtn.closest("form");
    if (!form) return;

    
    // Données issues du formulaire
    const startDate = form.querySelector("[name='startDate']")?.value;
    const endDate = form.querySelector("[name='endDate']")?.value;
    
    // Données issues de la sélection
    const reservations = extractReservationData(selections, { startDate, endDate });
    
    const summaryData = {
      clientName: form.querySelector("[name='clientName']")?.value || "",
      boatName: form.querySelector("[name='boatName']")?.value || "",
      reservations
    };

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

// Injection des sélections dans le formulaire avant soumission serveur
function injectSelectionsIntoForm(form, idsSet) {
  form.querySelectorAll('input[name="catways[]"]').forEach(i => i.remove());

  idsSet.forEach(id => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "catways[]";
    input.value = id;
    form.appendChild(input);
  });
}