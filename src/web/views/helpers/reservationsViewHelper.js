/**
 * VIEW HELPER - RESERVATIONS
 * =========================================================================================
 * @module reservationsViewHelper
 *
 * Helpers de rendu pour les pages Réservations.
 *
 * Responsabilités :
 * - Gérer le multi-step de création
 * - Centraliser l’injection des données vues
 * - Uniformiser les paramètres UI
 *
 * Effets de bord :
 * - Appel direct à res.render()
 */

/**
 * RENDER CREATE RESERVATION PAGE
 * =========================================================================================
 * Rend la page de création d’une réservation.
 *
 * @function renderCreateReservationPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {string} [params.step="client"]
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 * @param {Object} [params.formData]
 * @param {boolean} [params.hasSearched=false]
 * @param {Object[]} [params.availableCatways]
 * @param {Object|null} [params.preselectedCatway]
 *
 * @returns {void}
 */

export const renderCreateReservationPage = (res, {
    step = "client",
    errors = {},
    globalError = null,
    formData = {},
    hasSearched = false,
    availableCatways = [],
    preselectedCatway = null
}) => {
    res.render("reservations/create", {
        title: "Création d'une réservation",
        activePage : "reservations",
        bodyClass: "scroll-components create-page",
        step,
        errors,
        globalError,
        formData,
        hasSearched,
        availableCatways,
        preselectedCatway
    });
};

/**
 * RENDER EDIT RESERVATION PAGE
 * =========================================================================================
 * Rend la page d’édition d’une réservation.
 *
 * @function renderEditReservationPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {Object} params.reservation
 * @param {Object[]} [params.otherReservations]
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 * @param {Object} [params.formData]
 *
 * @returns {void}
 */

export const renderEditReservationPage = (res, {
    reservation,
    otherReservations = [],
    errors = {},
    globalError = null,
    formData = {}
}) => {
    res.render("reservations/edit", {
        title: "Édition d'une réservation",
        activePage : "reservations",
        bodyClass: "scroll-components edit-page",
        reservation,
        otherReservations,
        errors,
        globalError,
        formData
    });
};