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

        // Empêche une date de fin antérieure
        endDateInput.min = startDateInput.value;

        // Si la date de fin est vide ou invalide → on la synchronise
        if (!endDateInput.value || endDateInput.value < startDateInput.value) {
            endDateInput.value = startDateInput.value;
        }
    });
});