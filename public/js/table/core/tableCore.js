/**
 * ===================================================================
 * BULK TABLE CORE ENGINE
 * ===================================================================
 * - Gestion générique des tables avec seélection multiple
 * - Sélection multiple persistante (indépendante des filtres)
 * - "Select all" agit uniquement sur les lignes visibles
 * - Suppression en masse avec confirmation sécurisée
 * - Synchronisation UI dynamique (compteur, états)
 * ===================================================================
 * Principe clé :
 * → La sélection est conservée en mémoire même si la table change
 * ===================================================================
 */

/* global showToast */

import { runDeleteFlow } from "../../delete/deleteFlow.js";

export function initBulkTable({
  tableSelector,
  checkboxName,
  deleteBtnId,
  selectAllId,
  deleteUrl,
  deleteType,
  messages
}) {

  // ========================================================
  // DOM REFERENCES
  // ========================================================

  const table = document.querySelector(tableSelector);
  const deleteBtn = document.getElementById(deleteBtnId);
  const selectAll = document.getElementById(selectAllId);
  const deleteCountSpan = document.getElementById("delete-selected-count");

  if (!table || !deleteBtn) return;

  // Mémoire globale de sélection (indépendante des filtres)
  const selectedIds = new Set();

  // ==================================================
  // CHECKBOX HELPERS
  // ==================================================

  const getAllCheckboxes = () =>
    Array.from(table.querySelectorAll(`input[name='${checkboxName}']`));

  const getVisibleCheckboxes = () =>
    getAllCheckboxes().filter(cb => {
      const row = cb.closest("tr");
      return row && row.style.display !== "none";
    });

  // ==================================================
  // MEMORY - UI SYNCHRONISATION
  // ==================================================

  const syncCheckboxesWithMemory = () => {
    getAllCheckboxes().forEach(cb => {
      cb.checked = selectedIds.has(cb.value);
    });
  };

  // ==================================================
  // DELETE BUTTON STATE MANAGEMENT
  // ==================================================

  const updateDeleteButton = () => {
    const visibleCheckboxes = getVisibleCheckboxes();
    const visibleChecked = visibleCheckboxes.filter(cb => cb.checked).length;

    // Activation du bouton suppression
    deleteBtn.disabled = selectedIds.size === 0;

    // Mise à jour compteur dynamique
    if (deleteCountSpan) {
      deleteCountSpan.textContent =
        selectedIds.size > 0 ? ` (${selectedIds.size})` : "";
    }

    if (!selectAll) return;
    
    // Cas critique : zéro ligne trouvée
    if (visibleCheckboxes.length === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
        selectAll.disabled = true;
        return;
    }

    selectAll.disabled = false;

    // Tous les visibles cochés
    if (visibleChecked === visibleCheckboxes.length) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
        return;
    }
    
    // Aucun visible coché mais sélection existante (mémoire)
    if (visibleCheckboxes.length === 0) {
      selectAll.checked = false;
      selectAll.indeterminate = selectedIds.size > 0;
      return;
    }

    // Aucun visible coché mais sélection existante (mémoire)
    if (visibleChecked === 0) {
      selectAll.checked = false;
      selectAll.indeterminate = selectedIds.size > 0;
      return;
    }

    // Cas intermédiaire
    selectAll.checked = false;
    selectAll.indeterminate = true;
  };

  // ==================================================
  // INITIAL STATE
  // ==================================================

  syncCheckboxesWithMemory();
  updateDeleteButton();

  // ==================================================
  // ROW CHECKBOX EVENTS
  // ==================================================

  table.addEventListener("change", (e) => {
    if (!e.target.matches(`input[name='${checkboxName}']`)) return;

    const id = e.target.value;

    if (e.target.checked) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }

    updateDeleteButton();
  });

  // ==================================================
  // SELECT ALL (VISIBLE ROWS ONLY)
  // ==================================================

  if (selectAll) {
    selectAll.addEventListener("change", () => {
      getVisibleCheckboxes().forEach(cb => {
        cb.checked = selectAll.checked;

        if (selectAll.checked) {
          selectedIds.add(cb.value);
        } else {
          selectedIds.delete(cb.value);
        }
      });

      updateDeleteButton();
    });
  }

  // ==================================================
  // BULK DELETE FLOW
  // ==================================================

  deleteBtn.addEventListener("click", async () => {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);

    runDeleteFlow({
      deleteUrl,
      deleteType,
      count: ids.length,
      buildBody: (password) => ({ ids, password }),

      onSuccess: () => {

        // Animation suppression lignes
        ids.forEach(id => {
          const cb = table.querySelector(
            `input[name='${checkboxName}'][value='${id}']`
          );
          if (!cb) return;

          const row = cb.closest("tr");
          if (!row) return;

          row.classList.add("row-exit");
          row.addEventListener(
            "animationend",
            () => row.remove(),
            { once: true }
          );
        });

        selectedIds.clear();
        syncCheckboxesWithMemory();
        updateDeleteButton();

        if (selectAll) {
          selectAll.checked = false;
          selectAll.indeterminate = false;
        }

        showToast("success", messages.success(ids.length));
      }
    });
  });

  // ==================================================
  // EXTERNAL VISIBILITY EVENTS (FILTERS / SEARCH)
  // ==================================================
  
  document.addEventListener("table:visibility-change", () => {
    syncCheckboxesWithMemory();
    updateDeleteButton();
  });
}