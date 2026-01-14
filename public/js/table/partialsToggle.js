/**
 * ===================================================================
 * PARTIALS TOGGLE
 * ===================================================================
 * - Gère l’affichage du tableau des créneaux partiels
 * - Permet de basculer entre :
 *   - la liste principale des catways
 *   - la vue détaillée des créneaux partiels
 * - Re-synchronise l’état de sélection existant
 * ===================================================================
 */

import { hasSelection } from "./core/selectionStore.js";

// ==================================================
// DOM REFERENCES
// ==================================================

const resultsSection = document.getElementById("catways-results");
const partialsSection = document.getElementById("catway-partials");

const partialsTableBody = document.getElementById("partials-table-body");
const backToResultsBtn = document.getElementById("back-to-results");

// ==================================================
// UTILS
// ==================================================

function formatDateFR(date) {
  return date.toLocaleDateString("fr-FR");
}

function showSection(section) {
  section.hidden = false;
  section.setAttribute("aria-hidden", "false");
}

function hideSection(section) {
  section.hidden = true;
  section.setAttribute("aria-hidden", "true");
}

// ==================================================
// RENDERING
// ==================================================

// Crée une ligne de tableau pour un créneau partiel
// et restaure son état sélectionné si nécessaire.
function createPartialRow(catwayNumber, catwayType, slot) {
  const row = document.createElement("tr");

  const selectionId = `${catwayNumber}|${slot.from}|${slot.to}`;
  const isSelected = hasSelection(selectionId);

  const fromLabel = formatDateFR(new Date(slot.from));
  const toLabel = formatDateFR(new Date(slot.to));

  row.innerHTML = `
    <td class="align-center bold">${catwayNumber}</td>
    <td class="align-center">${catwayType}</td>
    <td class="align-center border-col-left">
      <span class="status status--warning">Partiel</span>
    </td>
    <td class="align-center">${fromLabel}</td>
    <td class="align-center">&ndash;</td>
    <td class="align-center">${toLabel}</td>
    <td class="align-center border-col-left">
      <button
        type="button"
        class="btn btn--primary btn-toggle${isSelected ? ' is-active' : ''}"
        aria-label="Réserver le catway ${catwayNumber} du ${fromLabel} au ${toLabel}"
        aria-pressed="${isSelected ? 'true' : 'false'}"
        data-selection-id="${selectionId}"
      >
        <span class="btn-label">Réserver</span>
        <i class="fa-solid fa-check btn-toggle-icon btn-toggle-icon--confirm" aria-hidden="true"></i>
        <i class="fa-solid fa-xmark btn-toggle-icon btn-toggle-icon--cancel" aria-hidden="true"></i>
      </button>
    </td>
  `;

  const toggleBtn = row.querySelector(".btn-toggle");
  if (hasSelection(selectionId)) {
    toggleBtn.classList.add("is-active");
  }

  return row;
}

// Rendu complet du tableau des créneaux partiels
function renderPartials(catwayNumber, catwayType, slots) {
  partialsTableBody.innerHTML = "";

  slots.forEach(slot => {
    partialsTableBody.appendChild(
      createPartialRow(catwayNumber, catwayType, slot)
    );
  });
}

// ==================================================
// VIEW MANAGEMENT
// ==================================================

function showPartialsView(catwayNumber, catwayType, slots) {
  renderPartials(catwayNumber, catwayType, slots);
  hideSection(resultsSection);
  showSection(partialsSection);
}

function showResultsView() {
  hideSection(partialsSection);
  showSection(resultsSection);
}

// ==================================================
// EVENTS
// ==================================================

// Affichage des créneaux partiels au clic
document.addEventListener("click", event => {
  const btn = event.target.closest(".btn-show-partials");
  if (!btn) return;

  const catwayNumber = btn.dataset.catway;
  const catwayType = btn.dataset.catwayType;
  const slots = JSON.parse(btn.dataset.slots);

  showPartialsView(catwayNumber, catwayType, slots);
});

// Retour à la liste principale
backToResultsBtn.addEventListener("click", showResultsView);