/**
 * ===================================================================
 * SIDEBAR CLOCK
 * ===================================================================
 * - Met à jour dynamiquement la date et l'heure affichées
 * - Rafraîchissement toutes les secondes
 * ===================================================================
 */

import { formatDateFR, formatTimeFR } from "../../utils/dateFormatter.js";

const dateEl = document.getElementById("sidebar-date");
const timeEl = document.getElementById("sidebar-time");

// ========================================================
// CLOCK INITIALIZATION
// ========================================================

if (dateEl && timeEl) {
    const updateClock = () => {
        const now = new Date();

        dateEl.textContent = formatDateFR(now);
        timeEl.textContent = formatTimeFR(now);
    };

    // Mise à jour immédiate
    updateClock();
    
    // Rafraîchissement chaque seconde
    setInterval(updateClock, 1000);
}