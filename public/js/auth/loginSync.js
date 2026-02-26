/**
 * AUTH - LOGIN SESSION SYNCHRONISATION
 * =========================================================================================
 * @module loginSync
 * 
 * Synchronise la connexion utilisateur entre plusieurs onglets.
 *
 * - Lit le flag data-just-logged-in injecté côté serveur
 * - Émet un message BroadcastChannel "LOGIN_SUCCESS"
 * - Recharge les autres onglets actifs lors de réception
 *
 * Dépendances :
 * - document.body.dataset.justLoggedIn
 * - BroadcastChannel "russell-session"
 *
 * Effets de bord :
 * - Peut déclencher un rechargement complet de la page
 */

(() => {

    // ========================================================
    // CHANNEL INITIALIZATION
    // ========================================================

    const channel = new BroadcastChannel("russell-session");

    // Flag injecté par le serveur après connexion réussi
    const justLoggedIn = document.body.dataset.justLoggedIn === "true";

    // ========================================================
    // LOGIN EVENT BROADCAST
    // ========================================================

    // Notifie les autres onglets qu'un login vient d'avoir lieu
    if (justLoggedIn) {
        channel.postMessage({ type: "LOGIN_SUCCESS" });
    }

    // ========================================================
    // CHANNEL LISTENER
    // ========================================================

    channel.onmessage = (event) => {
        const { type } = event.data || {};

        if (type !== "LOGIN_SUCCESS") return;

        // Recharge la page pour récupérer la nouvelle session
        window.location.reload(true);
    };

})();