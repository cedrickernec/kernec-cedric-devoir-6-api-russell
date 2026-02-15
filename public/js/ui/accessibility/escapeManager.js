/**
 * ===================================================================
 * GLOBAL ESCAPE KEY MANAGER
 * ===================================================================
 * - Centralise la gestion de la touche Escape
 * - Permet aux composant UI de s'enregistrer dynamiquement
 * - Ferme toujours le composant ouvert le plus récemment
 * ===================================================================
 */

class EscapeManager {

    // ==================================================
    // INITIALISATION
    // ==================================================
    /**
     * Pile de composants enregistrés. Chaque entrée doit contenir :
     * - id : identifiant unique du composant
     * - close : fonction de fermeture appelée
     */

    constructor() {
        // Stack des composants actifs
        // Le dernier élément représente le composant au premier plan
        this.stack = [];

        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            this.handleEscape();
        });
    }

    // ==================================================
    // COMPONENT REGISTRATION
    // ==================================================

    // Enregistre un composant dans la pile
    // Si déjà présent → remplacé pour éviter les doublons
    register(component) {
        this.stack = this.stack.filter(c => c.id !== component.id);
        this.stack.push(component);
    }

    // Retire un composant de la pile
    unregister(id) {
        this.stack = this.stack.filter(c => c.id !== id);
    }

    // ==================================================
    // ESCAPE HANDLING
    // ==================================================

    // Ferme uniquement le composant actif (dernier ouvert)
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