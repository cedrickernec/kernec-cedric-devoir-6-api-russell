/**
 * SIDEBAR CLOCK
 * =========================================================================================
 * @module sidebarClock
 * 
 * Horloge dynamique de la sidebar.
 *
 * Responsabilités :
 * - Mettre à jour la date et l'heure affichées
 * - Synchronisation immédiate au chargement
 * - Rafraîchissement automatique toutes les secondes
 *
 * Dépendances :
 * - formatDateFR
 * - formatTimeFR
 */

import { formatDateFR, formatTimeFR } from "../../utils/dateFormatter.js";

// ========================================================
// DOM REFERENCES
// ========================================================

const dateEl = document.getElementById("sidebar-date");
const timeEl = document.getElementById("sidebar-time");

// ========================================================
// CLOCK INITIALISATION
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