/**
 * ===================================================================
 * DOC MENU
 * ===================================================================
 * - Gestion du menu latéral de la page documentation
 * ===================================================================
 */

import { escapeManager } from "../accessibility/escapeManager.js";

console.log("docMenu loaded");
document.addEventListener("DOMContentLoaded", () => {
    const titles = document.querySelectorAll(".menu-title");

    titles.forEach(title => {
        const submenu = title.nextElementSibling;
        
        title.addEventListener("click", () => {
            const isOpen = title.classList.contains("open");
            
            // Fermeture des groupes (sauf celui cliqué)
            titles.forEach(t => {
                    t.classList.remove("open");
                    t.setAttribute("aria-expanded", "false");
                    t.nextElementSibling.classList.remove("open");

                    escapeManager.unregister("doc-menu");
                });

            // Ouvre/ferme celui cliqué
            if(!isOpen) {
                title.classList.add("open");
                title.setAttribute("aria-expanded", "true");
                submenu.hidden = false;
                submenu.classList.add("open");

                escapeManager.register({
                    id: "doc-menu",
                    close: () => {
                        title.classList.remove("open"),
                        title.setAttribute("aria-expanded", "false"),
                        submenu.classList.remove("open");
                    }
                });
            }
        });
    });
});