/**
 * ===================================================================
 * TOOLTIP SYSTEM
 * ===================================================================
 * - Affiche des info-bulles au survol
 * - Clone le contenu .tooltip__content dans un élément "floating"
 * - Positionnement intelligent :
 *      → par defaut à droite
 *      → bascule à gauche si dépassement
 *      → bascule en bas si dépassement en haut
 * ===================================================================
 * Convention DOM :
 *  <span class="tooltip">
 *      ...
 *      <span class="tooltip__content">Texte</span>
 *  </span>
 * ===================================================================
 */

let activeTooltip = null;
let activeTrigger = null;

// ==================================================
// HOVER IN
// ==================================================

document.addEventListener("mouseover", e => {
    const tooltip = e.target.closest(".tooltip");
    if (!tooltip) return;

    const content = tooltip.querySelector(".tooltip__content");
    if (!content) return;

    // Sécurité : une seule tooltip active
    if (activeTooltip) {
        activeTooltip.remove();
        activeTooltip = null;
    }

    activeTrigger = tooltip;

    // Clone du contenu tooltip (DOM "flottant")
    activeTooltip = content.cloneNode(true);
    activeTooltip.style.position = "fixed";
    activeTooltip.style.opacity = "1";
    activeTooltip.style.pointerEvents = "none";

    document.body.appendChild(activeTooltip);

    positionTooltip(activeTrigger, activeTooltip);
});

// ==================================================
// HOVER OUT
// ==================================================
// Écoute du mouseleave pour couvrir les sorties
// depuis les élements internes

document.addEventListener("mouseleave", e => {
    if (!activeTrigger) return;

    if (!activeTrigger.contains(e.relatedTarget)) {
        activeTooltip?.remove();
        activeTooltip = null;
        activeTrigger = null;
    }
}, true);

// ==================================================
// POSITIONING
// ==================================================

function positionTooltip(trigger, tooltip) {
    if (!trigger || !tooltip) return;

    // Reset classes d'orientation
    tooltip.classList.remove("is-left", "is-bottom");

    const triggerRect = trigger.getBoundingClientRect();
    const OFFSET = 25;

    // Position par défaut : à droite, centré verticalement
    let left = triggerRect.right + OFFSET;
    let top = triggerRect.top + triggerRect.height / 2;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = "translateY(-50%)";

    const tooltipRect = tooltip.getBoundingClientRect();

    // Dépasse à droite → bascule à gauche
    if (tooltipRect.right > window.innerWidth) {
        tooltip.style.left = `${triggerRect.left - tooltipRect.width - OFFSET}px`;
        tooltip.classList.add("is-left");
    }

    // Dépasse en haut → bascule en bas
    if (tooltipRect.top < 0) {
        tooltip.style.top = `${triggerRect.bottom + OFFSET}px`;
        tooltip.style.transform = "none";
        tooltip.classList.add("is-bottom");
    }
}