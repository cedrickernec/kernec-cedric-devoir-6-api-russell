/**
 * VIEW HELPER - CATWAYS
 * =========================================================================================
 * @module catwaysViewHelper
 *
 * Helpers de rendu pour les pages Catways.
 *
 * Responsabilités :
 * - Centraliser les appels res.render
 * - Uniformiser les propriétés envoyées aux vues
 * - Éviter la duplication dans les contrôleurs
 *
 * Dépendances :
 * - Moteur EJS configuré dans l’application
 *
 * Effets de bord :
 * - Appel direct à res.render()
 */

/**
 * RENDER CREATE CATWAY PAGE
 * =========================================================================================
 * Rend la page de création d’un catway.
 *
 * @function renderCreateCatwayPage
 *
 * @param {Object} res
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
 * RENDER EDIT CATWAY PAGE
 * =========================================================================================
 * Rend la page d’édition d’un catway.
 *
 * @function renderEditCatwayPage
 *
 * @param {Object} res
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