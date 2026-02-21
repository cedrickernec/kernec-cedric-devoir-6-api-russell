/**
 * ===================================================================
 * LAST NAVIGATION TRACKER
 * ===================================================================
 * - Mémorise la dernière page visitée par l'utilisateur
 * - Ignore API, assets et pages publiques
 * - Utilisé pour améliorer les redirections UX
 * ===================================================================
 */

export const rememberLastPath = (req, res, next) => {

    // ==================================================
    // ROUTE FILTERING
    // ==================================================

    const isAuthRoute = req.path.startsWith("/auth");
    const isApiRoute = req.path.startsWith("/api");
    const isStatic =
        req.path.startsWith("/js") ||
        req.path.startsWith("/css") ||
        req.path.startsWith("/images") ||
        req.path.startsWith("/.well-known");
    const isLoginPage = req.path === "/";

    const accept = req.headers.accept || "";
    const isHtmlNav = req.method === "GET" && accept.includes("text/html");

    // ==================================================
    // PATH STORAGE
    // ==================================================

    if (
        req.session.user &&
        isHtmlNav &&
        !isAuthRoute &&
        !isApiRoute &&
        !isStatic &&
        !isLoginPage
    ) {
        req.session.lastPath = req.originalUrl;
    }

    next();
};