/**
 * ===================================================================
 * LAST NAVIGATION TRACKER
 * ===================================================================
 * - Mémorise la dernière page visitée par l'utilisateur
 * - Ignore API, assets et pages publiques
 * - Utilisé pour améliorer les redirections UX
 * ===================================================================
 */

/**
 * Middleware de mémorisation du dernier chemin visité.
 *
 * - Stocke la dernière page HTML visitée
 * - Ignore routes API, assets statiques et login
 * - Utilisé pour améliorer les redirections UX
 *
 * @function rememberLastPath
 *
 * @param {Object} req - Requête Express
 * @param {string} req.path
 * @param {string} req.method
 * @param {Object} req.headers
 * @param {Object} req.session
 * @param {Object} [req.session.user]
 * @param {string} req.originalUrl
 *
 * @param {Object} res - Réponse Express
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
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