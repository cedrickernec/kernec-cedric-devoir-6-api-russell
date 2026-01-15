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

    const warningDelay = sessionDuration - 60_000;

    // ========================================================
    // DOM REFERENCES
    // ========================================================
    
    const warningBox = document.getElementById("session-warning");
    const stayBtn = document.getElementById("stay-connected");

    // ========================================================
    // GUARD CLAUSE
    // ========================================================

    if (!warningBox || !stayBtn) {
        console.warn("Session warning elements missing");
        return;
    }

    // ========================================================
    // MODE PREVIEW (DEV)
    // ========================================================

    if (forceWarning) {
        console.info("Session warning forced (DEV mode)");
        warningBox.classList.remove("hidden");
        return;
    }

    // ========================================================
    // SESSION LIFECYCLE
    // ========================================================

    // Timer d'avertissement
    window._warningTimer = setTimeout(() => {
        warningBox.classList.remove("hidden");
    }, warningDelay);

    // Timer d'expiration
    const redirectOnExpire = "/";

    window._expireTimer = setTimeout(() => {
        window.location.href = redirectOnExpire;
    }, sessionDuration);

    // Bouton "Rester connecté"
    stayBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/auth/refresh-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            if (response.ok) {
                console.warn("Échec du refresh de session");
                return;
            }
            
            warningBox.classList.add("hidden");
            resetTimers();
            
        } catch (error) {
            console.error("Erreur lors du refresh de session :", error)
        }
    });

    // Reset des timers
    function resetTimers() {
        clearTimeout(window._warningTimer);
        clearTimeout(window._expireTimer);

        window._warningTimer = setTimeout(() => {
            warningBox.classList.remove("hidden");
        }, warningDelay);

        window._expireTimer = setTimeout(() => {
            window.location.href = "/";
        }, sessionDuration);
    }
})();