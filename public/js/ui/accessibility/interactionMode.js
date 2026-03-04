/**
 * INTERACTION MODE MODULE
 * =========================================================================================
 * @module interactionMode
 *
 * Détecte si l'utilisateur interagit via clavier ou souris.
 *
 * Objectif :
 * - Adapter le style du focus (classe body "using-keyboard")
 * - Améliorer l'accessibilité visuelle
 *
 * Expose une API simple : isKeyboardInteraction().
 */

// =====================================================
// STATE
// =====================================================

let lastInteractionWasKeyboard = false;

// =====================================================
// MODE SWITCHERS
// =====================================================

function setKeyboardMode() { // Active le mode calvier
    lastInteractionWasKeyboard = true;

    document.body.classList.add("using-keyboard");
}

function setMouseMode() { // Active le mode souris
    lastInteractionWasKeyboard = false;

    document.body.classList.remove("using-keyboard");
}

// =====================================================
// EVENT HANDLERS
// (Détecte une interaction clavier pertinente)
// =====================================================

function handleKeydown(e) {
    if (
        e.key === "Tab" ||
        e.key === "Enter" ||
        e.key === " " ||
        e.code === "Space"
    ) {
        setKeyboardMode();
    }
}

// Interaction souris → Mode souris
function handleMousedown() {
    setMouseMode();
}

// =====================================================
// GLOBAL LISTENERS
// =====================================================

document.addEventListener("keydown", handleKeydown, true);
document.addEventListener("mousedown", handleMousedown, true);

/**
 * INTERACTION MODE DETECTOR
 * =========================================================================================
 * Indique si la dernière interaction pertinente
 * a été effectuée au clavier.
 *
 * @function isKeyboardInteraction
 * 
 * @returns {boolean}
 */

export function isKeyboardInteraction() {
    return lastInteractionWasKeyboard;
}