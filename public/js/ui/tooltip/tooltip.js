/**
 * ==============================================================
 * TOOLTIP SYSTEM (UI LAYER PORTAL)
 * ==============================================================
 * - Une seule tooltip globale rendue dans #ui-layer
 * - Animation gérée uniquement par le CSS existant
 * - Positionnement intelligent selon l'espace disponible :
 *      → RIGHT → LEFT → BOTTOM → TOP
 * ============================================================== */

function initTooltipSystem() {

    // ==================================================
    // INITIALISATION
    // ==================================================

    const layer = document.getElementById("ui-layer");
    if (!layer) return;

    const OFFSET = 10;
    let activeTrigger = null;

    // Tooltip unique
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-floating";
    layer.appendChild(tooltip);

    // ==================================================
    // POSITION CHECK HELPER
    // ==================================================

    function fitsRight(r, t) {
        return r.right + OFFSET + t.width < window.innerWidth;
    }

    function fitsLeft(r, t) {
        return r.left - OFFSET - t.width > 0;
    }

    function fitsBottom(r, t) {
        return r.bottom + OFFSET + t.height < window.innerHeight;
    }

    // ==================================================
    // POSITIONING ENGINE
    // ==================================================

    function position(trigger) {

        const r = trigger.getBoundingClientRect();

        // Position temporaire pour mesurer la tooltip
        tooltip.style.left = "0px";
        tooltip.style.top = "0px";

        const t = tooltip.getBoundingClientRect();

        tooltip.classList.remove(
            "tooltip-right",
            "tooltip-left",
            "tooltip-bottom",
            "tooltip-top"
        );

        let x, y;

        // ---- PRIORITÉ RIGHT
        if (fitsRight(r, t)) {
            tooltip.classList.add("tooltip-right");

            x = r.right + OFFSET;
            y = r.top + r.height / 2 - t.height / 2;
        }

        // ---- LEFT
        else if (fitsLeft(r, t)) {
            tooltip.classList.add("tooltip-left");

            x = r.left - t.width - OFFSET;
            y = r.top + r.height / 2 - t.height / 2;
        }

        // ---- BOTTOM
        else if (fitsBottom(r, t)) {
            tooltip.classList.add("tooltip-bottom");

            x = r.left + r.width / 2 - t.width / 2;
            y = r.bottom + OFFSET;
        }

        // ---- TOP (fallback)
        else {
            tooltip.classList.add("tooltip-top");

            x = r.left + r.width / 2 - t.width / 2;
            y = r.top - t.height - OFFSET;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    // ==================================================
    // VISIBILITY CONTROL
    // ==================================================

    function show(trigger) {
        activeTrigger = trigger;
        tooltip.textContent = trigger.dataset.tooltip || "";

        tooltip.style.transition = "none";
        tooltip.classList.add("is-visible")

        position(trigger);

        tooltip.offsetHeight;
        tooltip.style.transition = "";
    }

    function hide() {
        tooltip.classList.remove("is-visible");
        activeTrigger = null;
    }

    // ==================================================
    // EVENTS
    // ==================================================

    // Hover IN
    document.addEventListener("mouseover", e => {
        const trigger = e.target.closest("[data-tooltip]");
        if (!trigger) return;
        show(trigger);
    });

    // Hover OUT
    document.addEventListener("mouseout", e => {
        if (!activeTrigger) return;
        if (activeTrigger.contains(e.relatedTarget)) return;
        hide();
    });

    // Reposition ON SCROLL
    document.addEventListener("scroll", () => {
        if (activeTrigger) position(activeTrigger);
    }, true);

    // Reposition ON RESIZE
    window.addEventListener("resize", () => {
        if (activeTrigger) position(activeTrigger);
    });
}

initTooltipSystem();