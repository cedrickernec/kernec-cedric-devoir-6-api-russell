/**
 * VIEW HELPER - CREATE PAGE RENDER
 * =========================================================================================
 * Rend la page de création d'un catway.
 *
 * - Centralise les données envoyées à la vue
 * - Gère les erreurs et valeurs par défaut
 *
 * @function renderCreateCatwayPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 * @param {Object} [params.formData]
 * @param {number|null} [params.startNumber]
 * @param {number|null} [params.endNumber]
 *
 * @returns {void}
 */

export const renderCreateCatwayPage = (res, {
    errors = {},
    globalError = null,
    formData = {},
    startNumber = null,
    endNumber = null
}) => {
    res.render("catways/create", {
        title: "Création d'un catway",
        activePage : "catways",
        bodyClass: "scroll-main create-page",
        errors,
        globalError,
        formData,
        startNumber,
        endNumber
    });
};


/**
 * VIEW HELPER - EDIT PAGE RENDER
 * =========================================================================================
 * Rend la page d'édition d'un catway.
 *
 * - Injecte les données du catway
 * - Injecte les erreurs éventuelles
 *
 * @function renderEditCatwayPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {Object} params.catway
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 *
 * @returns {void}
 */

export const renderEditCatwayPage = (res, {
    catway,
    errors = {},
    globalError = null
}) => {
    res.render("catways/edit", {
        title: "Édition d'un catway",
        activePage : "catways",
        bodyClass: "scroll-main edit-page",
        catway,
        errors,
        globalError
    });
};