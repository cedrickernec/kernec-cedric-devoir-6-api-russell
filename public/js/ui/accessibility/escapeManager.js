/**
 * ===================================================================
 * GLOBAL MANAGEMENT ESCAPE KEY
 * ===================================================================
 * - Centraliser la gestion de la touche Escape dans l'application
 * - Permetttre aux composant UI de s'enregistrer dynamiquement
 * - Toujours fermer le composant le plus récemment ouvert
 * ===================================================================
 */

class EscapeManager {

    // ==================================================
    // INIT
    // ==================================================
    /**
     * Pile de composants enregistrés. Chaque entrée doit contenir :
     * - id : identifiant unique du composant
     * - close : fonction de fermeture appelée
     */

    constructor() {
        this.stack = [];

        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            this.handleEscape();
        });
    }

    // ==================================================
    // REGISTRATION COMPONENTS
    // ==================================================

    register(component) {
        this.stack = this.stack.filter(c => c.id !== component.id);
        this.stack.push(component);
    }

    unregister(id) {
        this.stack = this.stack.filter(c => c.id !== id);
    }

    // ==================================================
    // MANAGING TOUCH ESCAPE
    // ==================================================

    handleEscape() {
        if (this.stack.length === 0) return;
        const top = this.stack[this.stack.length - 1];
        if (typeof top.close === "function") {
            top.close();
        }
        this.unregister(top.id);
    }
}

export const escapeManager = new EscapeManager();