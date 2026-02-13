export const rememberLastPath = (req, res, next) => {

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