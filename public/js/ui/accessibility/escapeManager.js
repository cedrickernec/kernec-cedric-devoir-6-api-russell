/**
 * GLOBAL ESCAPE MANAGER MODULE
 * =========================================================================================
 * @module escapeManager
 *
 * Gestionnaire global de la touche Escape basé sur une pile LIFO.
 *
 * Objectif :
 * - Permettre à plusieurs composants UI (modale, panel, menu...)
 *   de s'enregistrer dynamiquement
 * - Garantir que seul le composant actif (dernier ouvert)
 *   soit fermé lors d'un appui sur Escape
 *
 * Architecture :
 * - Stack interne
 * - Pattern Last In, First Out
 */

/**
 * GLOBAL ESCAPE MANAGER
 * =========================================================================================
 * Gère la pile des composants enregistrés
 * et orchestre la fermeture via la touche Escape.
 *
 * @class EscapeManager
 */

class EscapeManager {

    // ==================================================
    // INITIALISATION
    // ==================================================

    constructor() {
        // Stack des composants actifs
        // Le dernier élément représente le composant au premier plan
        this.stack = [];

        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            this.handleEscape();
        });
    }

    /**
     * STACK COMPONENT SAVING
     * =========================================================================================
     * Enregistre un composant dans la pile
     * (remplace si déjà présent → mis au premier plan).
     * 
     * @param {{ id: string, close: Function }} component
     * 
     * @returns {void}
     */
    register(component) {
        this.stack = this.stack.filter(c => c.id !== component.id);
        this.stack.push(component);
    }

    /**
     * STACK COMPONENT REMOVING
     * =========================================================================================
     * Retire un composant de la pile.
     * 
     * @param {string} id
     * 
     * @returns {void}
     */
    unregister(id) {
        this.stack = this.stack.filter(c => c.id !== id);
    }

    /**
     * ESCAPE HANDLING
     * =========================================================================================
     * Ferme le composant actif (dernier ouvert).
     * 
     * @returns {void}
     */

    handleEscape() {
        if (this.stack.length === 0) return;
        const top = this.stack[this.stack.length - 1];
        if (typeof top.close === "function") {
            top.close();
        }
        this.unregister(top.id);
    }
}

// Instance globale partagée
export const escapeManager = new EscapeManager();