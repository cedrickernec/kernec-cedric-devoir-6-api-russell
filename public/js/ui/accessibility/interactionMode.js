/**
 * ===================================================================
 * INTERACTION MODE DETECTOR
 * ===================================================================
 * - Détecte si l'utilisateur navigue au clavier ou à la souris
 * - Permet d'adapter l'affichage du focus
 * - Synchronise JS et CSS via la classe body → using-kerboard
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

// Interaction souris → Mode souris
function handleMousedown() {
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