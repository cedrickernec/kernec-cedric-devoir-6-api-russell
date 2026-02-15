/**
 * ===================================================================
 * AUTH - LOGIN SESSION SYNCHRONISATION
 * ===================================================================
 * - Synchronise la connexion entre plusieurs onglets
 * - Lorsqu'un login est effectué :
 *      → envoie un event broadcastChannel
 *      → force le rechargement des autres onglets ouverts
 * ===================================================================
 * Utilise broadcastChannel pour partager l'état de session
 * entre les contextes navigateur actifs.
 * ===================================================================
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