/**
 * ===================================================================
 * SESSION LIFECYCLE CONTROLLER
 * ===================================================================
 * - Affiche un avertissement d'expiration
 * - Permet l'actualisation de la session
 * - Redirige à l'expiration
 * - Mode aperçu DEV pris en charge
 * ===================================================================
 */

(() => {

    // ========================================================
    // CONFIGURATION
    // ========================================================

    // Durée de session injectée par EJS
    const sessionDuration = Number(document.body.dataset.sessionMaxAge);
    const forceWarning = document.body.dataset.forceWarning === "true";

    // ========================================================
    // SESSION TIMING
    // ========================================================

    const warningDelay = sessionDuration - 120_000; // 2 minutes avant expiration

    // ========================================================
    // STATE
    // ========================================================

    let warningTimer = null;
    let expireTimer = null;
    let expirationAt = null;
    let lastReset = 0;

    // ========================================================
    // DOM REFERENCES
    // ========================================================
    
    const warningBox = document.getElementById("session-warning");
    const stayBtn = document.getElementById("stay-connected");
    const remainingTimeEl = document.getElementById("remaining-time");
    const countdownBox = document.getElementById("session-countdown");

    // ========================================================
    // SESSION REMAINING TIME
    // ========================================================

    function getRemainingTime() {
        if (!expirationAt) return "inconnu";

        const ms = expirationAt - Date.now();
        const seconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        const paddedSec = sec < 10 ? `0${sec}` : sec;
        
        return `${minutes}:${paddedSec}`;
    }

    // ========================================================
    // UPDATE REMAINING TIME TEXT
    // ========================================================

    function updateRemainingTimeElement() {
        if (!remainingTimeEl || !countdownBox) return;

        const ms = expirationAt - Date.now();
        const seconds = Math.max(0, Math.floor(ms / 1000));

        remainingTimeEl.textContent = getRemainingTime();

        if (seconds < 30) {
            countdownBox.classList.add("session-countdown--danger");
        } else {
            countdownBox.classList.remove("session-countdown--danger");
        }
    }

    // ========================================================
    // GUARD CLAUSE
    // ========================================================

    if (!warningBox || !stayBtn) {
        console.warn("🚨 Éléments d'avertissement d'expiration de session manquants");
        return;
    }

    // ========================================================
    // MODE PREVIEW (DEV)
    // ========================================================

    if (forceWarning) {
        console.info(
            "⚠️ Avertissement : Visibilité de la modale de session volontairement forcée (DEV mode)"
        );

        warningBox.classList.remove("hidden");

        startTimers();
        setInterval(updateRemainingTimeElement, 1000);

        return;
    }

    // ========================================================
    // TIMERS
    // ========================================================

    const redirectOnExpire = "/";

    function startTimers() {
        expirationAt = Date.now() + sessionDuration;

        // Timer d'avertissement
        warningTimer = setTimeout(() => {
            warningBox.classList.remove("hidden");
        }, warningDelay);

        // Time d'expiration
        expireTimer = setTimeout(() => {
            window.location.href = redirectOnExpire;
        }, sessionDuration);
    }

    function resetTimers() {
        clearTimeout(warningTimer);
        clearTimeout(expireTimer);
        startTimers();
        updateRemainingTimeElement();
    }

    // ========================================================
    // ACTIVITY LISTENERS
    // ========================================================

    function registerActivity() {
        const now = Date.now();

        // Reset toutes les secondes uniquement
        if (now - lastReset < 1000) return;
        lastReset = now;

        // Si modale visible → on ne fait rien
        if(!warningBox.classList.contains("hidden")) {
            return
        };

        resetTimers();
    }
    
    ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "input", "change"]
    .forEach(event => window.addEventListener(event, registerActivity, { passive: true }));

    // ========================================================
    // ACTIONS : STAY CONNECTED
    // ========================================================

    stayBtn.addEventListener("click", async (e) => {

        e.preventDefault();

        try {
            const response = await fetch("/auth/keep-alive", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (!response.ok) {
                console.warn("💥 Echec du refresh de session 'keep-alive'");
                return;
            }
            
            warningBox.classList.add("hidden");
            resetTimers();
            
        } catch (error) {
            console.error("❗ Erreur lors du refresh de session 'keep-alive' :", error);
        }
    });

    // ========================================================
    // START TIMERS
    // ========================================================

    startTimers();
    setInterval(updateRemainingTimeElement, 1000);
})();