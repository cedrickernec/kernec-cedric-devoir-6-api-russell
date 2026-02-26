/**
 * AUTH - LOGOUT SESSION SYNCHRONISATION
 * =========================================================================================
 * @module logoutSync
 * 
 * Synchronise la déconnexion utilisateur entre plusieurs onglets.
 *
 * - Intercepte les clics sur les liens "/auth/logout"
 * - Émet un message BroadcastChannel "FORCE_LOGOUT"
 * - Les autres onglets peuvent réagir à cet événement
 *
 * Dépendances :
 * - BroadcastChannel "russell-session"
 * - Présence d’un lien a[href="/auth/logout"]
 *
 * Effets de bord :
 * - Émet un message inter-onglet
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