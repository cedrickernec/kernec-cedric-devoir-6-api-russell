/**
 * ===================================================================
 * INTERACTION MODE TRACKING (KEYBOARD/MOUSE)
 * ===================================================================
 * - Détecte si la dernière interaction a été effectuée à l'aide 
 *   du clavier ou de la souris
 * - Utilisé pour conditionner la gestion du focus
 * - Consommé par JS (logique) et CSS (focus-visible)
 * ===================================================================
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

function handleMousedown() { // Interaction souris → Mode souris
    setMouseMode();
}

// =====================================================
// GLOBAL LISTENERS
// =====================================================

document.addEventListener("keydown", handleKeydown, true);
document.addEventListener("mousedown", handleMousedown, true);

// =====================================================
// PUBLIC API
// =====================================================

export function isKeyboardInteraction() {
    return lastInteractionWasKeyboard;
}