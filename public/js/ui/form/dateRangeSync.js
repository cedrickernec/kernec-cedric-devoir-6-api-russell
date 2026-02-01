/**
 * ===================================================================
 * CALENDAR SYNCRONISATION
 * ===================================================================
 * - Empèche une sélection de date antérieur à la date de début saisie
 * - Synchronise la date de fin en fonction de la date de début saisie
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    const startDateInput = document.querySelector('input[name="startDate"]');
    const endDateInput   = document.querySelector('input[name="endDate"]');

    if (!startDateInput || !endDateInput) return;

    startDateInput.addEventListener("change", () => {
        if (!startDateInput.value) return;

        const start = new Date(startDateInput.value);

        // + 1 jour minimum (logique "nuit")
        start.setDate(start.getDate() + 1);

        const minEndDate = start.toISOString().split("T")[0];

        // Empêche une date de fin invalide
        endDateInput.min = minEndDate;

        // Si la date de fin est vide ou invalide → on la synchronise
        if (!endDateInput.value || endDateInput.value < minEndDate) {
            endDateInput.value = minEndDate;
        }
    });
});