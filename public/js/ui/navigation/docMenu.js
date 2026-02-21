/**
 * ===================================================================
 * DOC MENU
 * ===================================================================
 * - Gère l'ouverture / fermeture des sections du menu latéral
 * - Ferme automatiquement les autres sections lors d'un clic
 * - Supporte la fermeture via la touche Escape
 * ===================================================================
 */

import { escapeManager } from "../accessibility/escapeManager.js";

document.addEventListener("DOMContentLoaded", () => {

    // ==================================================
    // DOM REFERENCES
    // ==================================================

    const titles = document.querySelectorAll(".menu-title");
    if (!titles.length) return;

    // ==================================================
    // UI HELPERS
    // ==================================================

    function closeGroup(title) {
        const submenu = title.nextElementSibling;
        if (!submenu) return;

        title.classList.remove("open");
        title.setAttribute("aria-expanded", "false");

        submenu.classList.remove("open");

        submenu.addEventListener("transitionend", () => {
            if (!submenu.classList.contains("open")) {
                submenu.hidden = true;
            }
        }, { once: true });
    }

    function openGroup(title) {
        const submenu = title.nextElementSibling;
        if (!submenu) return;

        title.classList.add("open");
        title.setAttribute("aria-expanded", "true");

        submenu.hidden = false;

        requestAnimationFrame(() => {
            submenu.classList.add("open");
        })
    }

    function closeAllExcept(currentTitle) {
        titles.forEach(t => {
            if (t === currentTitle) return;
            closeGroup(t);
        });

        // On retire l'écoute Escape précédente
        escapeManager.unregister("doc-menu");
    }

    // ==================================================
    // EVENTS
    // ==================================================

    titles.forEach(title => {

        // Accessibilité : état fermé par défaut
        if (!title.classList.contains("open")) {
            title.setAttribute("aria-expanded", "false");
            title.nextElementSibling && (title.nextElementSibling.hidden = true);
        }

        title.addEventListener("click", () => {

            const isOpen = title.classList.contains("open");

            // Ferme tous les autres groupes
            closeAllExcept(title);

            // Toggle du groupe cliqué
            if (isOpen) {
                closeGroup(title);
                return;
            }

            openGroup(title);

            // Enregistre Escape uniquement quand un groupe est ouvert
            const submenu = title.nextElementSibling;

            escapeManager.register({
                id: "doc-menu",
                close: () => {
                closeGroup(title);
                submenu?.classList.remove("open");
                }
            });
        });
    });
});