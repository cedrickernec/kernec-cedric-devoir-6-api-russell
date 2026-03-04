/**
 * RESERVATION VALIDATION CONTROLLER
 * =========================================================================================
 * @module reservationValidationController
 *
 * Gère le processus de validation finale d’une réservation côté UI.
 *
 * Rôle :
 * - Orchestrer la récupération des données formulaire + sélection
 * - Construire le modèle de récapitulatif
 * - Déclencher la modale de confirmation
 * - Finaliser l’injection avant soumission
 *
 * Ce module agit comme couche de coordination entre
 * la table, le résumé métier et la modale système.
 */

import { getSelections } from "../../table/core/selectionStore.js";
import { extractReservationData } from "../../table/reservation/reservationRecap.js";
import { reservationSummary } from "../../ui/modal/reservationSummary.js";

/**
 * CONTROLER INITIALISATION
 * =========================================================================================
 * Initialise le contrôleur de validation de réservation.
 *
 * Attache un listener sur le bouton de validation
 * et pilote le flux complet de confirmation.
 *
 * @function initReservationValidation
 * 
 * @returns {void}
 */

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

/**
 * FORM INJECTION HELPERS
 * =========================================================================================
 * Injecte dynamiquement les identifiants sélectionnés
 * dans le formulaire avant soumission.
 *
 * Comportement :
 * - Nettoie les injections précédentes
 * - Génère des inputs hidden "catways[]"
 *
 * @function injectSelectionsIntoForm
 * 
 * @param {HTMLFormElement} form
 * @param {Set<string>} idsSet
 * 
 * @returns {void}
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