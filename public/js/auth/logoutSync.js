(() => {
    const channel = new BroadcastChannel("russell-session");

    function handleLogoutClick(event) {
        const link = event.currentTarget;

        if (!link || !link.getAttribute) return;

        const href = link.getAttribute("href");
        if (!href || !href.includes("/auth/logout")) return;

        channel.postMessage({ type: "FORCE_LOGOUT" });

        // On laisse la navigation continuer normalement
    }

    document.addEventListener("DOMContentLoaded", () => {
        const logoutLinks = document.querySelectorAll('a[href="/auth/logout"]');
        logoutLinks.forEach(link => {
            link.addEventListener("click", handleLogoutClick);
        });
    });
})();