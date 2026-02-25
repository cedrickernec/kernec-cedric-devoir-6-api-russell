/**
 * ===================================================================
 * DOCUMENTATION VIEW CONTROLLER
 * ===================================================================
 * - Affiche la documentation technique de l'API
 * - Utilise un layout dédié documentation
 * ===================================================================
 */

// ==================================================
// DOCUMENTATION PAGE
// ==================================================
/**
 * Affiche la page de documentation technique.
 *
 * @function getDocumentation
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {void}
 */
export const getDocumentation = (req, res, next) => {
    try {
        res.render("documentation/index", {
            title: "Documentation de l'API Russell",
            layout: "layouts/docLayout",
            bodyClass: "scroll-main doc-page"
        });
        
    } catch (error) {
        error.status = 500;
        error.ui = {
            showBack: false,
            showLogout: false
        };
        next(error);
    }
};