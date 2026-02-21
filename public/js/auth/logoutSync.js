/**
 * ===================================================================
 * AUTH - LOGOUT SESSION SYNCHRONISATION
 * ===================================================================
 * - Synchronise la déconnexion entre plusieurs onglets
 * - Lorsqu'un logout est effectué :
 *      → envoie un event broadcastChannel
 *      → force la déconnexion des autres onglets ouverts
 * ===================================================================
 * La navigation continue normalement après émission.
 * ===================================================================
 */

(() => {

    // ========================================================
    // CHANNEL INITIALIZATION
    // ========================================================

    const channel = new BroadcastChannel("russell-session");

    // ========================================================
    // LOGOUT HANDLER
    // ========================================================

    function handleLogoutClick(event) {
        const link = event.currentTarget;

        if (!link || !link.getAttribute) return;

        const href = link.getAttribute("href");

        // Sécurité : ne cible que les liens logout
        if (!href || !href.includes("/auth/logout")) return;

        // Notifie les autres onglets qu'un logout vient d'avoir lieu
        channel.postMessage({ type: "FORCE_LOGOUT" });

        // Navigation normale ensuite
    }

    // ========================================================
    // EVENT BINDING
    // ========================================================

    document.addEventListener("DOMContentLoaded", () => {
        const logoutLinks = document.querySelectorAll('a[href="/auth/logout"]');
        logoutLinks.forEach(link => {
            link.addEventListener("click", handleLogoutClick);
        });
    });
    
})();