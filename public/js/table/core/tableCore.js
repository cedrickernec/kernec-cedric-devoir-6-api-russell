/**
 * ===================================================================
 * TABLE CORE
 * ===================================================================
 * - Sélection multiple persistante (indépendante des filtres)
 * - "Select all" agit uniquement sur les lignes visibles
 * - Suppression en masse sur l'ensemble de la sélection mémorisée
 * - Compteur dynamique dans le bouton "Supprimer"
 * ===================================================================
 */

import { confirmDelete } from "../../ui/modal/confirmDelete.js";

export function initBulkTable({
  tableSelector,
  checkboxName,
  deleteBtnId,
  selectAllId,
  deleteUrl,
  deleteType,
  messages
}) {

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
  // SYNC CHECKBOXES WITH MEMORY
  // ==================================================
  const syncCheckboxesWithMemory = () => {
    getAllCheckboxes().forEach(cb => {
      cb.checked = selectedIds.has(cb.value);
    });
  };

  // ==================================================
  // DELETE BUTTON + SELECT ALL STATE
  // ==================================================
  const updateDeleteButton = () => {
    const visibleCheckboxes = getVisibleCheckboxes();
    const visibleChecked = visibleCheckboxes.filter(cb => cb.checked).length;

    // Bouton supprimer (basé sur la mémoire globale)
    deleteBtn.disabled = selectedIds.size === 0;

    // Compteur dynamique
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
  // ROW CHECKBOX HANDLING
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
  // SELECT ALL (VISIBLE ONLY)
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
  // BULK DELETE
  // ==================================================
  deleteBtn.addEventListener("click", async () => {
    if (selectedIds.size === 0) return;

    const ids = Array.from(selectedIds);

    openConfirmModal({
      title: "Confirmation",
      content: confirmDelete({
        type: deleteType,
        count: ids.length
      }),

      onConfirm: async () => {
        const res = await fetch(deleteUrl, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids })
        });

        if (!res.ok) {
          showToast("error", messages.error);
          return;
        }

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
      },

      onCancel: () => {
        if (messages.cancelled) {
          showToast("info", messages.cancelled);
        }
      }
    });
  });

  // ==================================================
  // FILTRE / VISIBILITÉ MODIFIÉE
  // ==================================================
  document.addEventListener("table:visibility-change", () => {
    syncCheckboxesWithMemory();
    updateDeleteButton();
  });
}