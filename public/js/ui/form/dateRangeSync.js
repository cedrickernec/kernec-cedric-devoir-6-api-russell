/**
 * CALENDAR SYNCRONISATION
 * =========================================================================================
 * @module dateRangeSync
 * 
 * Synchronise les champs startDate / endDate.
 *
 * Règles appliquées :
 * - La date de fin ne peut pas être antérieure à la date de début
 * - Minimum 1 nuit obligatoire
 * - Ajustement automatique si la date de fin devient invalide
 *
 * Effets de bord :
 * - Modifie l'attribut min du champ endDate
 * - Met à jour automatiquement la valeur si nécessaire
 */

document.addEventListener("DOMContentLoaded", () => {
    const startDateInput = document.querySelector('input[name="startDate"]');
    const endDateInput   = document.querySelector('input[name="endDate"]');

    if (!startDateInput || !endDateInput) return;

    // =====================================================
    // START DATE CHANGE HANDLER
    // =====================================================

    startDateInput.addEventListener("change", () => {
        if (!startDateInput.value) return;

        const start = new Date(startDateInput.value);

        // Logique métier "minimum 1 nuit"
        start.setDate(start.getDate() + 1);

        const minEndDate = start.toISOString().split("T")[0];

        // Empêche une date de fin invalide
        endDateInput.min = minEndDate;

        // Synchronisation automatique si nécessaire
        if (!endDateInput.value || endDateInput.value < minEndDate) {
            endDateInput.value = minEndDate;
        }
    });
});