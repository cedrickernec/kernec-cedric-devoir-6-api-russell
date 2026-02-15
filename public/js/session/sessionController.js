/**
 * ===================================================================
 * SESSION LIFECYCLE CONTROLLER
 * ===================================================================
 * - Gère le cycle de vie complet de la session utilisateur
 * - Affiche un avertissement avant expiration
 * - Permet le refresh manuel ("Stay connected")
 * - Déconnecte automatiquement à l'expiration
 * - Synchronisation multi-onglets via BroadcastChannel
 * - Supporte un mode preview DEV
 * ===================================================================
 * Source des données :
 * - sessionMaxAge injecté côté serveur via EJS
 * - UI pilotée uniquement côté client
 * ===================================================================
 */

(() => {

    // ========================================================
    // CONFIGURATION (INJECTÉE SERVEUR)
    // ========================================================

    // Durée totale de session (ms)
    const sessionDuration = Number(document.body.dataset.sessionMaxAge);
    // Mode DEV : force l'affichage warning
    const forceWarning = document.body.dataset.forceWarning === "true";

    // Sécurité : désactive le controller si config invalide
    if (!Number.isFinite(sessionDuration) || sessionDuration <= 0) {
        console.warn("🚨 sessionController désactivé : sessionMaxAge invalide →", sessionDuration);
        return;
    }

    // ========================================================
    // SESSION TIMING CONFIG
    // ========================================================

    // Affiche l'avertissement 2 minutes avant expiration
    const warningDelay = Math.max(0, sessionDuration - 120_000);

    // ========================================================
    // INTERNAL STATE
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
    // MULTI TAB SYNCHRONISATION
    // ========================================================

    const sessionChannel = new BroadcastChannel("russell-session");

    function notifyAllTabs(type, payload = {}) {
        sessionChannel.postMessage({ type, payload });
    }

    sessionChannel.onmessage = (event) => {
        const { type } = event.data || {};

        switch (type) {
            case "RESET_TIMERS":
                clearTimeout(warningTimer);
                clearTimeout(expireTimer);
                startTimers();
                updateRemainingTimeElement();
                break;

            case "SHOW_WARNING":
                warningBox.classList.remove("hidden");
                break;

            case "HIDE_WARNING":
                warningBox.classList.add("hidden");
                break;

            case "FORCE_LOGOUT":
                window.location.href = "/auth/logout";
                break;
        }
    };

    // ========================================================
    // SESSION REMAINING TIME CALCULATION
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
    // COUNTDOWN UI UPDATE
    // ========================================================

    function updateRemainingTimeElement() {
        if (!remainingTimeEl || !countdownBox) return;

        const ms = expirationAt - Date.now();
        const seconds = Math.max(0, Math.floor(ms / 1000));

        remainingTimeEl.textContent = getRemainingTime();

        // Mise en danger visuelle < 30s
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
    // SESSION TIMERS MANAGEMENT
    // ========================================================

    const redirectOnExpire = "/";

    function startTimers() {
        expirationAt = Date.now() + sessionDuration;

        // Timer d'avertissement
        warningTimer = setTimeout(() => {
            warningBox.classList.remove("hidden");
            notifyAllTabs("SHOW_WARNING");
        }, warningDelay);

        // Timer d'expiration
        expireTimer = setTimeout(() => {
            notifyAllTabs("FORCE_LOGOUT");
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
    // USER ACTIVITY LISTENERS
    // ========================================================

    function registerActivity() {
        const now = Date.now();

        // Reset toutes les secondes uniquement
        if (now - lastReset < 1000) return;
        lastReset = now;

        // Si modale visible → pas de reset automatique
        if (!warningBox.classList.contains("hidden")) {
            return;
        }

        // Onglet actif : reset local + broadcast aux autres
        resetTimers();
        notifyAllTabs("RESET_TIMERS");
    }

    [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "input",
        "change"
    ].forEach(event =>
        window.addEventListener(event, registerActivity, { passive: true })
    );

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

            // Onglet actif : reset local + broadcast
            resetTimers();
            notifyAllTabs("RESET_TIMERS");
            notifyAllTabs("HIDE_WARNING");

        } catch (error) {
            console.error("❗ Erreur lors du refresh de session 'keep-alive' :", error);
        }
    });

    // ========================================================
    // INITIAL START
    // ========================================================

    startTimers();
    setInterval(updateRemainingTimeElement, 1000);

})();